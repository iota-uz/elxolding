package controllers

import (
	"net/http"
	"strconv"

	"github.com/iota-uz/elxolding-erp/internal/templates/pages/login"
	"github.com/iota-uz/iota-sdk/modules/core/presentation/mappers"
	"github.com/iota-uz/iota-sdk/modules/core/presentation/viewmodels"
	"github.com/iota-uz/iota-sdk/modules/core/services"
	"github.com/iota-uz/iota-sdk/pkg/application"
	"github.com/iota-uz/iota-sdk/pkg/di"
	"github.com/iota-uz/iota-sdk/pkg/middleware"

	"github.com/gorilla/mux"
)

func NewLoginController(app application.Application) application.Controller {
	return &LoginController{
		app: app,
	}
}

type LoginController struct {
	app application.Application
}

func (c *LoginController) Key() string {
	return "/login"
}

func (c *LoginController) Register(r *mux.Router) {
	router := r.PathPrefix("/login").Subrouter()
	router.Use(
		middleware.WithTransaction(),
		middleware.ProvideLocalizer(c.app.Bundle()),
		middleware.WithPageContext(),
	)
	router.HandleFunc("", di.H(c.Get)).Methods(http.MethodGet)
	router.HandleFunc("", di.H(c.Post)).Methods(http.MethodPost)
}

func (c *LoginController) Get(
	w http.ResponseWriter, r *http.Request,
	userService *services.UserService,
) {
	viewUsers := make([]*viewmodels.User, 0)
	users, err := userService.GetAll(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	for _, user := range users {
		viewUsers = append(viewUsers, mappers.UserToViewModel(user))
	}
	props := &login.LoginPageProps{
		Users: viewUsers,
	}
	if err := login.Index(props).Render(r.Context(), w); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func (c *LoginController) Post(
	w http.ResponseWriter, r *http.Request,
	authService *services.AuthService,
) {
	if err := r.ParseForm(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	userId, err := strconv.ParseInt(r.FormValue("userId"), 10, 64)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	password := r.FormValue("password")
	if userId == 0 || password == "" {
		http.Error(w, "userId or password is empty", http.StatusBadRequest)
		return
	}
	cookie, err := authService.CookieAuthenticateWithUserID(r.Context(), uint(userId), password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	http.SetCookie(w, cookie)
	http.Redirect(w, r, "/", http.StatusFound)
}
