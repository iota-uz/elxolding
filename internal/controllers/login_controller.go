package controllers

import (
	"github.com/iota-uz/elxolding-erp/internal/templates/pages/login"
	"github.com/iota-uz/iota-sdk/modules/core/presentation/mappers"
	"github.com/iota-uz/iota-sdk/modules/core/presentation/viewmodels"
	"github.com/iota-uz/iota-sdk/modules/core/services"
	"github.com/iota-uz/iota-sdk/pkg/application"
	"github.com/iota-uz/iota-sdk/pkg/middleware"
	"github.com/iota-uz/iota-sdk/pkg/types"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/iota-uz/iota-sdk/pkg/composables"
)

func NewLoginController(app application.Application) application.Controller {
	return &LoginController{
		app:         app,
		userService: app.Service(services.UserService{}).(*services.UserService),
		authService: app.Service(services.AuthService{}).(*services.AuthService),
	}
}

type LoginController struct {
	app         application.Application
	userService *services.UserService
	authService *services.AuthService
}

func (c *LoginController) Key() string {
	return "/login"
}

func (c *LoginController) Register(r *mux.Router) {
	router := r.PathPrefix("/login").Subrouter()
	router.Use(
		middleware.WithTransaction(),
		middleware.WithLocalizer(c.app.Bundle()),
	)
	router.HandleFunc("", c.Get).Methods(http.MethodGet)
	router.HandleFunc("", c.Post).Methods(http.MethodPost)
}

func (c *LoginController) Get(w http.ResponseWriter, r *http.Request) {
	pageCtx, err := composables.UsePageCtx(r, types.NewPageData("Login.Meta.Title", ""))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	viewUsers := make([]*viewmodels.User, 0)
	users, err := c.userService.GetAll(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	for _, user := range users {
		viewUsers = append(viewUsers, mappers.UserToViewModel(user))
	}
	props := &login.LoginPageProps{
		PageContext: pageCtx,
		Users:       viewUsers,
	}
	if err := login.Index(props).Render(r.Context(), w); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func (c *LoginController) Post(w http.ResponseWriter, r *http.Request) {
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
	cookie, err := c.authService.CoockieAuthenticateWithUserId(r.Context(), uint(userId), password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	http.SetCookie(w, cookie)
	http.Redirect(w, r, "/", http.StatusFound)
}
