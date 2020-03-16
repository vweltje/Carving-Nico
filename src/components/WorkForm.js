import React, { Fragment } from 'react'
import Helmet from 'react-helmet'
import { Link } from 'gatsby'
import { stringify } from 'qs'
import { serialize } from 'dom-form-serializer'

import './Form.css'

class Form extends React.Component {
  static defaultProps = {
    name: 'bestelling',
    subject: '', // optional subject of the notification email
    action: '',
    successMessage:
      'Bedankt voor je bestelling. Ik neem contact met je op om de bestelling af te ropnden.',
    errorMessage:
      'Oeps, er is wat mis gegaan, jouw bericht kon niet verzonden worden. Probeer het op een later opnieuw. Mijn excusses voor het ongemak!'
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
    const { name, subject, action, workItemName } = this.props

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
          data-netlify="true"
          data-netlify-recaptcha="true"
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
          <div
            className="g-recaptcha"
            data-sitekey="6LfIq98UAAAAALcfJLl1wstv3pJlp5FweJWS34Fs"
          ></div>
          <input type="hidden" name="geintreseerd-in" value={workItemName} />
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
