package controllers

import (
	"github.com/iota-agency/elxolding-erp/internal/services"
	"github.com/iota-agency/elxolding-erp/internal/templates/pages/dashboard"
	"github.com/iota-agency/iota-sdk/pkg/application"
	"github.com/iota-agency/iota-sdk/pkg/middleware"
	"github.com/iota-agency/iota-sdk/pkg/types"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/iota-agency/iota-sdk/pkg/composables"
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

func (c *DashboardController) Register(r *mux.Router) {
	router := r.Methods(http.MethodGet).Subrouter()
	router.Use(
		middleware.Authorize(),
		middleware.RequireAuthorization(),
		middleware.ProvideUser(),
		middleware.Tabs(),
		middleware.WithLocalizer(c.app.Bundle()),
		middleware.NavItems(c.app),
	)
	router.HandleFunc("/", c.Get)
}

func (c *DashboardController) Get(w http.ResponseWriter, r *http.Request) {
	pageCtx, err := composables.UsePageCtx(r, types.NewPageData("Dashboard.Meta.Title", ""))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	stats, err := c.dashboardService.GetStats(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	props := &dashboard.IndexPageProps{
		PageContext:    pageCtx,
		PositionsCount: strconv.FormatInt(stats.PositionsCount, 10),
		ProductsCount:  strconv.FormatInt(stats.ProductsCount, 10),
		Depth:          strconv.FormatFloat(stats.Depth, 'f', 2, 64),
		OrdersCount:    strconv.FormatInt(stats.OrdersCount, 10),
	}
	if err := dashboard.Index(props).Render(r.Context(), w); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
