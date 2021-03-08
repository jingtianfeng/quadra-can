import {html, LitElement} from 'https://cdn.skypack.dev/lit-element'

// noinspection JSUnusedGlobalSymbols
class NametagTable extends LitElement {
    static get properties() {
        return {
            nametags: {type: Array},
            downloadCSVHref: {type: String},
            downloadCSVFilename: {type: String},
        }
    }

    constructor() {
        super()

        this.nametags = [
            {
                first_name: 'Loading...',
                last_name: 'Loading...',
                organization: 'Loading...',
                title: 'Loading...',
            }
        ]
        this.downloadCSVHref = ''
        this.downloadCSVFilename = 'nametags.csv'
    }

    render() {
        return html`
            <div class="columns">
                <div class="column">
                    <div class="notification">
                        <p class="mb-0">
                            The table underneath displays all the RSVPed name tags.
                            As a good security measure, please use the Google Cloud Platform's console to edit the
                            fields.
                        </p>
                    </div>
                </div>
                <div class="column">
                    <a class="button"
                       href="${this.downloadCSVHref}"
                       download="${this.downloadCSVFilename}">
                        Download CSV
                    </a>
                </div>
            </div>

            <table class="table is-hoverable">
                <thead>
                <tr>
                    <th>Last Name</th>
                    <th>First Name</th>
                    <th>Organization</th>
                    <th>Title</th>
                </tr>
                </thead>
                <tbody>
                ${this.nametags.map(({first_name, last_name, organization, title}) => {
                    return html`
                        <tr>
                            <td>${last_name}</td>
                            <td>${first_name}</td>
                            <td>${organization}</td>
                            <td>${title}</td>
                        </tr>
                    `
                })}
                </tbody>
            </table>`
    }

    createRenderRoot() {
        return this
    }

    connectedCallback() {
        super.connectedCallback()

        this.getNametags().then(() => {
            this._setDownloadCSVHref()
        })
    }

    async getNametags() {
        const res = await fetch('/admin/attendees')
        const nametags = await res.json()
        this.nametags = nametags.sort((a, b) => {
            // Sort ascending: last name followed by first name
            const aNameUppercase = (a.last_name + a.first_name).toUpperCase()
            const bNameUppercase = (b.last_name + b.first_name).toUpperCase()
            if (aNameUppercase < bNameUppercase) {
                return -1
            } else if (aNameUppercase > bNameUppercase) {
                return 1
            } else {
                return 0
            }
        })
    }

    _setDownloadCSVHref() {
        const nametagsCSV = this.__convertArrayOfObjectsToCSV({
            data: this.nametags
        })
        if (nametagsCSV === null) {
            return undefined
        } else {
            this.downloadCSVHref = encodeURI('data:text/csv;charset=utf-8,' + nametagsCSV)
        }
    }

    __convertArrayOfObjectsToCSV({data, columnDelimiter = ',', lineDelimiter = '\n'}) {
        if (data == null || !data.length) {
            return null
        } else {
            let result = ''
            const keys = Object.keys(data[0])
            result += keys.join(columnDelimiter)
            result += lineDelimiter
            data.forEach((obj) => {
                let lineCSV = ''
                for (let i = 0; i < keys.length - 1; i++) {
                    lineCSV += obj[keys[i]]
                    lineCSV += columnDelimiter
                }
                lineCSV += obj[keys[keys.length - 1]]
                lineCSV += lineDelimiter
                result += lineCSV
            })
            return result
        }
    }
}

customElements.define('nametag-table', NametagTable)