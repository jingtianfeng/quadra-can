import {html, LitElement} from "https://cdn.skypack.dev/lit-element"

// noinspection JSUnusedGlobalSymbols,DuplicatedCode
class NametagForm extends LitElement {
    static get properties() {
        return {
            firstName: {type: String},
            firstNameIsValid: {type: Boolean},
            firstNameHelp: {type: String},

            lastName: {type: String},
            lastNameIsValid: {type: Boolean},
            lastNameHelp: {type: String},

            organization: {type: String},
            organizationIsValid: {type: Boolean},
            organizationHelp: {type: String},

            title: {type: String},
            titleIsValid: {type: Boolean},
            titleHelp: {type: String},

            formIsValid: {type: Boolean},
            signupHelp: {type: String},
        }
    }

    constructor() {
        super()

        this.firstName = ''
        this.firstNameIsValid = false
        this.firstNameHelp = ''

        this.lastName = ''
        this.lastNameIsValid = false
        this.lastNameHelp = ''

        this.organization = ''
        this.organizationIsValid = false
        this.organizationHelp = ''

        this.title = ''
        this.titleIsValid = false
        this.titleHelp = ''

        this.formIsValid = false
        this.signupHelp = ''
    }

    render() {
        return html`
            <fieldset>
                <label>
                    First Name
                    <input id="nametag-form-first-name"
                           type="text"
                           class="input"
                           .value="${this.firstName}"
                           @input="${this.inputFirstName}">
                </label>
                <h6>${this.firstNameHelp}</h6>
            </fieldset>

            <fieldset>
                <label>
                    Last Name
                    <input id="nametag-form-last-name"
                           type="text"
                           .value="${this.lastName}"
                           @input="${this.inputLastName}">
                </label>
                <h6 class="help">${this.lastNameHelp}</h6>
            </fieldset>

            <fieldset>
                <label>
                    Organization
                    <input id="nametag-form-organization"
                           type="text"
                           placeholder="ex: Quadra Chemicals"
                           .value="${this.organization}"
                           @input="${this.inputOrganization}">
                </label>
                <h6 class="help">${this.organizationHelp}</h6>
            </fieldset>

            <fieldset>
                <label>
                    Title
                    <input id="nametag-form-title"
                           type="text"
                           placeholder="ex: Business Manager"
                           .value="${this.title}"
                           @input="${this.inputTitle}">
                </label>
                <h6 class="help">${this.titleHelp}</h6>
            </fieldset>

            <fieldset>
                <button @click="${this.signup}">
                    Signup
                </button>
                <button @click="${this.reset}">
                    Reset
                </button>
                <h6>${this.signupHelp}</h6>
            </fieldset>
        `
    }

    createRenderRoot() {
        return this
    }

    inputFirstName() {
        const firstName = document.getElementById("nametag-form-first-name")
        this.firstName = firstName.value
        this._validateFirstName()
    }

    _validateFirstName() {
        if (!this.firstName) {
            this.firstNameIsValid = false
            this.firstNameHelp = 'Cannot be empty.'
        } else {
            this.firstNameIsValid = true
            this.firstNameHelp = ''
        }
    }

    inputLastName() {
        const lastName = document.getElementById("nametag-form-last-name")
        this.lastName = lastName.value
        this._validateLastName()
    }

    _validateLastName() {
        if (!this.lastName) {
            this.lastNameIsValid = false
            this.lastNameHelp = 'Cannot be empty.'
        } else {
            this.lastNameIsValid = true
            this.lastNameHelp = ''
        }
    }

    inputOrganization() {
        const organization = document.getElementById("nametag-form-organization")
        this.organization = organization.value
        this._validateOrganization()
    }

    _validateOrganization() {
        if (!this.organization) {
            this.organizationIsValid = false
            this.organizationHelp = 'Cannot be empty.'
        } else {
            this.organizationIsValid = true
            this.organizationHelp = ''
        }
    }

    inputTitle() {
        const title = document.getElementById("nametag-form-title")
        this.title = title.value
        this._validateTitle()
    }

    _validateTitle() {
        if (!this.title) {
            this.titleIsValid = false
            this.titleHelp = 'Cannot be empty.'
        } else {
            this.titleIsValid = true
            this.titleHelp = ''
        }
    }

    reset() {
        this.firstName = ''
        this.firstNameIsValid = false
        this.firstNameHelp = ''

        this.lastName = ''
        this.lastNameIsValid = false
        this.lastNameHelp = ''

        this.organization = ''
        this.organizationIsValid = false
        this.organizationHelp = ''

        this.title = ''
        this.titleIsValid = false
        this.titleHelp = ''

        this.formIsValid = false
    }

    async signup() {
        this._validateFirstName()
        this._validateLastName()
        this._validateOrganization()
        this._validateTitle()

        if (!this.firstNameIsValid || !this.lastNameIsValid || !this.organizationIsValid || !this.titleIsValid) {
            this.formIsValid = false
        } else {
            const res = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    first_name: this.firstName,
                    last_name: this.lastName,
                    organization: this.organization,
                    title: this.title,
                })
            })
            if (res.status === 200) {
                this.signupHelp = `Thanks for signing up ${this.firstName}!`
                this.reset()
            } else {
                this.signupHelp = 'Oops! Something went wrong with the server...'
            }
        }
    }
}

customElements.define("nametag-form", NametagForm)