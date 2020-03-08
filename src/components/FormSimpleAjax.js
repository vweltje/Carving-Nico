import React, { Fragment } from 'react'
import Helmet from 'react-helmet'
import { Link } from 'gatsby'
import { stringify } from 'qs'
import { serialize } from 'dom-form-serializer'

import './Form.css'

class Form extends React.Component {
  static defaultProps = {
    name: 'Simple Form Ajax',
    subject: '', // optional subject of the notification email
    action: '',
    successMessage: 'Thanks for your enquiry, we will get back to you soon',
    errorMessage:
      'There is a problem, your message has not been sent, please try contacting us via email'
  }

  state = {
    alert: '',
    disabled: false
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.state.disabled) return

    const form = e.target
    const data = serialize(form)
    this.setState({ disabled: true })
    fetch(form.action + '?' + stringify(data), {
      method: 'POST'
    })
      .then(res => {
        if (res.ok) {
          return res
        } else {
          throw new Error('Network error')
        }
      })
      .then(() => {
        form.reset()
        this.setState({
          alert: this.props.successMessage,
          disabled: false
        })
      })
      .catch(err => {
        console.error(err)
        this.setState({
          disabled: false,
          alert: this.props.errorMessage
        })
      })
  }

  render() {
    const { name, subject, action } = this.props

    return (
      <Fragment>
        <Helmet>
          <script src="https://www.google.com/recaptcha/api.js" />
        </Helmet>
        <form
          className="Form"
          name={name}
          action={action}
          onSubmit={this.handleSubmit}
          data-netlify=""
          netlify-recaptcha=""
        >
          {this.state.alert && (
            <div className="Form--Alert">{this.state.alert}</div>
          )}
          <div className="Form--Group">
            <label className="Form--Label">
              <input
                className="Form--Input Form--InputText"
                type="text"
                placeholder="Voornaam"
                name="voornaam"
                required
              />
              <span>Voornaam</span>
            </label>
            <label className="Form--Label">
              <input
                className="Form--Input Form--InputText"
                type="text"
                placeholder="Achternaam"
                name="achternaam"
                required
              />
              <span>Achternaam</span>
            </label>
          </div>
          <label className="Form--Label">
            <input
              className="Form--Input Form--InputText"
              type="email"
              placeholder="E-mailadres"
              name="e-mail-adres"
              required
            />
            <span>E-mailadres</span>
          </label>
          <label className="Form--Label">
            <textarea
              className="Form--Input Form--Textarea Form--InputText"
              placeholder="Bericht"
              name="bericht"
              rows="10"
              required
            />
            <span>Bericht</span>
          </label>
          <label className="Form--Label Form-Checkbox">
            <input
              className="Form--Input Form--Textarea Form--CheckboxInput"
              name="voorwaarden"
              type="checkbox"
            />
            <span>
              Ik ga akkoord met de <Link to="/voorwarden">voorwaarden</Link>
            </span>
          </label>
          <div
            className="g-recaptcha"
            data-sitekey="6Lelq98UAAAAAO-5-dEftEsN3FwQc3VGz8Malquc"
          />
          {!!subject && <input type="hidden" name="subject" value={subject} />}
          <input type="hidden" name="form-name" value={name} />
          <input
            className="Button Form--SubmitButton"
            type="submit"
            value="Verstuur"
            disabled={this.state.disabled}
          />
        </form>
      </Fragment>
    )
  }
}

export default Form
