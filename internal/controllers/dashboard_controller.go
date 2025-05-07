package controllers

import (
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/iota-uz/iota-sdk/pkg/application"
	"github.com/iota-uz/iota-sdk/pkg/middleware"

	"github.com/iota-uz/elxolding-erp/internal/services"
	"github.com/iota-uz/elxolding-erp/internal/templates/pages/dashboard"
)

func NewDashboardController(app application.Application) application.Controller {
	return &DashboardController{
		app:              app,
		dashboardService: app.Service(services.DashboardService{}).(*services.DashboardService),
	}
}

type DashboardController struct {
	app              application.Application
	dashboardService *services.DashboardService
}

func (c *DashboardController) Key() string {
	return "/"
}

func (c *DashboardController) Register(r *mux.Router) {
	router := r.Methods(http.MethodGet).Subrouter()
	router.Use(
		middleware.Authorize(),
		middleware.RedirectNotAuthenticated(),
		middleware.ProvideUser(),
		middleware.Tabs(),
		middleware.ProvideLocalizer(c.app.Bundle()),
		middleware.NavItems(),
		middleware.WithPageContext(),
	)
	router.HandleFunc("/", c.Get)
}

func (c *DashboardController) Get(w http.ResponseWriter, r *http.Request) {
	stats, err := c.dashboardService.GetStats(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	props := &dashboard.IndexPageProps{
		PositionsCount: strconv.FormatInt(stats.PositionsCount, 10),
		ProductsCount:  strconv.FormatInt(stats.ProductsCount, 10),
		Depth:          strconv.FormatFloat(stats.Depth, 'f', 2, 64),
		OrdersCount:    strconv.FormatInt(stats.OrdersCount, 10),
	}
	if err := dashboard.Index(props).Render(r.Context(), w); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
