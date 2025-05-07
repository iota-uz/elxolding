package controllers

import (
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	"github.com/iota-uz/iota-sdk/modules/core/domain/aggregates/user"
	"github.com/iota-uz/iota-sdk/pkg/constants"
)

type SaveAccountDTO struct {
	FirstName  string `validate:"required"`
	LastName   string `validate:"required"`
	MiddleName string
	UILanguage string `validate:"required"`
	AvatarID   uint
}

func (u *SaveAccountDTO) Ok(l ut.Translator) (map[string]string, bool) {
	errors := map[string]string{}
	errs := constants.Validate.Struct(u)
	if errs == nil {
		return errors, true
	}
	for _, err := range errs.(validator.ValidationErrors) {
		errors[err.Field()] = err.Translate(l)
	}
	return errors, len(errors) == 0
}

func (u *SaveAccountDTO) ToEntity(id uint) (*user.User, error) {
	lang, err := user.NewUILanguage(u.UILanguage)
	if err != nil {
		return nil, err
	}
	return &user.User{
		ID:         id,
		FirstName:  u.FirstName,
		LastName:   u.LastName,
		MiddleName: u.MiddleName,
		UILanguage: lang,
		AvatarID:   &u.AvatarID,
	}, nil
}
