import React, { Component } from 'react';

import './FirForm.css';

class FirForm extends Component {
  constructor(props) {
    super(props);
    this.state = {    
      formData: {
        Versione: 1.0,
        IdDocumento: null,
        DataCreazione: null,
        Autore: {
          IdSoftware: "SoftwareXYZ",
          EmailURI: "software@xyz.com",
          VersioneSoftware: 2.0,
        },
        DatiFormulario: {
          DataEmissione: null,
          NumeroFormulario: null,
          ProduttoreDetentore: {
            CodiceFiscale: null,
            Denominazione: null,
            Indirizzo: {
              Paese: {
                id: null,
              },
              Comune: {
                istat: null,
              },
              Provincia: null,
              Localita: null,
              Via: null,
              Civico: null,
              CAP: null,
              NumeroScala: null,
              NumeroPiano: null,
            },
            Contatto: {
              Nome: null,
              Cognome: null,
              Telefono: null,
              Email: null,
            },
          },
          Destinatario: {
            CodiceFiscale: null,
            Denominazione: null,
            Indirizzo: {
              Paese: {
                id: null,
              },
              Comune: {
                istat: null,
              },
              Provincia: null,
              Localita: null,
              Via: null,
              Civico: null,
              CAP: null,
              NumeroScala: null,
              NumeroPiano: null,
            },
            Contatto: {
              Nome: null,
              Cognome: null,
              Telefono: null,
              Email: null,
            },
          },
          Trasportatori: {
            Trasportatore: {
              id: null,
              CodiceFiscale: null,
              Denominazione: null,
              Indirizzo: {
                Paese: {
                  id: null,
                },
                Comune: {
                  istat: null,
                },
                Provincia: null,
                Localita: null,
                Via: null,
                Civico: null,
                CAP: null,
                NumeroScala: null,
                NumeroPiano: null,
              },
              Contatto: {
                Nome: null,
                Cognome: null,
                Telefono: null,
                Email: null,
              },
              AutorizzazioneAlbo: {
                NumeroIscrizione: null,
                DataIscrizione: null,
              },
            },
          },
          CaratteristicheRifiuto: {
            CodiceEER: null,
            DenominazioneEER: null,
            DescrizioneRifiuto: null,
            StatoFisico: null,
            ClassePericolo: null,
            NumeroColli: null,
            TipoImballaggio: null,
            CaratteristicheChimicoFisiche: null,
          },
          DestinazioneRifiuto: {
            OperazioneRecupero: null,
            OperazioneSmaltimento: null,
          }
        }
      }
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => {
      const keys = name.split('.');
      const newState = { ...prevState };
      let target = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }
      target[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    // Invia i dati a backend o effettua altre operazioni qui
    console.log(this.state.formData);
  };

  render() {
    return (
      <div className="formContainer">
        <form onSubmit={this.handleSubmit}>
          
          {/* Produttore Detentore */}
          <div className="form-section">
            <h2 className="section-title">Produttore/Detentore</h2>
            <div className="form-group">
              <input
                type="text"
                className="input-medium"
                placeholder="Codice Fiscale"
                name="formData.DatiFormulario.ProduttoreDetentore.CodiceFiscale"
                value={this.state.formData.DatiFormulario.ProduttoreDetentore.CodiceFiscale || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-large"
                placeholder="Denominazione"
                name="formData.DatiFormulario.ProduttoreDetentore.Denominazione"
                value={this.state.formData.DatiFormulario.ProduttoreDetentore.Denominazione || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <h3 className="group-title">Indirizzo</h3>
              <input
                type="text"
                className="input-small"
                placeholder="Paese ID"
                name="formData.DatiFormulario.ProduttoreDetentore.Indirizzo.Paese.id"
                value={this.state.formData.DatiFormulario.ProduttoreDetentore.Indirizzo.Paese.id || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-medium"
                placeholder="Comune ISTAT"
                name="formData.DatiFormulario.ProduttoreDetentore.Indirizzo.Comune.istat"
                value={this.state.formData.DatiFormulario.ProduttoreDetentore.Indirizzo.Comune.istat || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-small"
                placeholder="Provincia"
                name="formData.DatiFormulario.ProduttoreDetentore.Indirizzo.Provincia"
                value={this.state.formData.DatiFormulario.ProduttoreDetentore.Indirizzo.Provincia || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-medium"
                placeholder="Località"
                name="formData.DatiFormulario.ProduttoreDetentore.Indirizzo.Localita"
                value={this.state.formData.DatiFormulario.ProduttoreDetentore.Indirizzo.Localita || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-large"
                placeholder="Via"
                name="formData.DatiFormulario.ProduttoreDetentore.Indirizzo.Via"
                value={this.state.formData.DatiFormulario.ProduttoreDetentore.Indirizzo.Via || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-small"
                placeholder="Civico"
                name="formData.DatiFormulario.ProduttoreDetentore.Indirizzo.Civico"
                value={this.state.formData.DatiFormulario.ProduttoreDetentore.Indirizzo.Civico || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-small"
                placeholder="CAP"
                name="formData.DatiFormulario.ProduttoreDetentore.Indirizzo.CAP"
                value={this.state.formData.DatiFormulario.ProduttoreDetentore.Indirizzo.CAP || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <h3 className="group-title">Contatto</h3>
              <input
                type="text"
                className="input-medium"
                placeholder="Nome"
                name="formData.DatiFormulario.ProduttoreDetentore.Contatto.Nome"
                value={this.state.formData.DatiFormulario.ProduttoreDetentore.Contatto.Nome || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-small"
                placeholder="Telefono"
                name="formData.DatiFormulario.ProduttoreDetentore.Contatto.Telefono"
                value={this.state.formData.DatiFormulario.ProduttoreDetentore.Contatto.Telefono || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-large"
                placeholder="Email"
                name="formData.DatiFormulario.ProduttoreDetentore.Contatto.Email"
                value={this.state.formData.DatiFormulario.ProduttoreDetentore.Contatto.Email || ''}
                onChange={this.handleChange}
              />
            </div>
          </div>


          {/* Destinatario */}
          <div className="form-section">
            <h2>Destinatario</h2>
            <div className="form-group">
              <label>Codice Fiscale:</label>
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Destinatario.CodiceFiscale"
                value={this.state.formData.DatiFormulario.Destinatario.CodiceFiscale || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Denominazione:</label>
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Destinatario.Denominazione"
                value={this.state.formData.DatiFormulario.Destinatario.Denominazione || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Paese:</label>
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Destinatario.Indirizzo.Paese.id"
                value={this.state.formData.DatiFormulario.Destinatario.Indirizzo.Paese.id || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Comune (Istat):</label>
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Destinatario.Indirizzo.Comune.istat"
                value={this.state.formData.DatiFormulario.Destinatario.Indirizzo.Comune.istat || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Provinica</label>
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Destinatario.Indirizzo.Provincia"
                value={this.state.formData.DatiFormulario.Destinatario.Indirizzo.Provincia || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Localita:</label>
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Destinatario.Indirizzo.Localita"
                value={this.state.formData.DatiFormulario.Destinatario.Indirizzo.Localita || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Via:</label>
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Destinatario.Indirizzo.Via"
                value={this.state.formData.DatiFormulario.Destinatario.Indirizzo.Via || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Civico:</label>
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Destinatario.Indirizzo.Civico"
                value={this.state.formData.DatiFormulario.Destinatario.Indirizzo.Civico || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>CAP:</label>
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Destinatario.Indirizzo.CAP"
                value={this.state.formData.DatiFormulario.Destinatario.Indirizzo.CAP || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>NumeroScala:</label>
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Destinatario.Indirizzo.NumeroScala"
                value={this.state.formData.DatiFormulario.Destinatario.Indirizzo.NumeroScala || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>NumeroPiano:</label>
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Destinatario.Indirizzo.NumeroPiano"
                value={this.state.formData.DatiFormulario.Destinatario.Indirizzo.NumeroPiano || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Nome Contatto:</label>
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Destinatario.Contatto.Nome"
                value={this.state.formData.DatiFormulario.Destinatario.Contatto.Nome || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Telefono Contatto:</label>
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Destinatario.Contatto.Telefono"
                value={this.state.formData.DatiFormulario.Destinatario.Contatto.Telefono || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Telefono Contatto:</label>
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Destinatario.Contatto.Email"
                value={this.state.formData.DatiFormulario.Destinatario.Contatto.Email || ''}
                onChange={this.handleChange}
              />
            </div>
          </div>

          {/* Trasportatori */}
          <div className="form-section">
            <h2>Trasportatore</h2>
            <div className="form-group">
              <label>ID:</label>
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.id"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.id || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Codice Fiscale:</label>
              <input
                type="text"
                className="form-control"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.CodiceFiscale"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.CodiceFiscale || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Denominazione:</label>
              <input
                type="text"
                className="form-control"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Denominazione"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Denominazione || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Paese:</label>
              <input
                type="text"
                className="form-control"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Paese.id"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Paese.id || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Comune (Istat):</label>
              <input
                type="text"
                className="form-control"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Comune.istat"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Comune.istat || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Provincia:</label>
              <input
                type="text"
                className="form-control"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Provincia"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Provincia || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Localita:</label>
              <input
                type="text"
                className="form-control"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Localita"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Localita || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Via:</label>
              <input
                type="text"
                className="form-control"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Via"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Via || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Civico:</label>
              <input
                type="text"
                className="form-control"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Civico"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Civico || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>CAP:</label>
              <input
                type="text"
                className="form-control"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.CAP"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.CAP || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>NumeroScala:</label>
              <input
                type="text"
                className="form-control"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.NumeroScala"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.NumeroScala || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>NumeroPiano:</label>
              <input
                type="text"
                className="form-control"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.NumeroPiano"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.NumeroPiano || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Nome Contatto:</label>
              <input
                type="text"
                className="form-control"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Contatto.Nome"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Contatto.Nome || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Telefono Contatto:</label>
              <input
                type="text"
                className="form-control"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Contatto.Telefono"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Contatto.Telefono || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <h3>Autorizzazione Albo</h3>
              <div className="form-group">
                <label>Numero Iscrizione:</label>
                <input
                  type="text"
                  className="form-control"
                  name="formData.DatiFormulario.Trasportatori.Trasportatore.AutorizzazioneAlbo.NumeroIscrizione"
                  value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.AutorizzazioneAlbo.NumeroIscrizione || ''}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label>Data Iscrizione:</label>
                <input
                  type="text"
                  className="form-control"
                  name="formData.DatiFormulario.Trasportatori.Trasportatore.AutorizzazioneAlbo.DataIscrizione"
                  value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.AutorizzazioneAlbo.DataIscrizione || ''}
                  onChange={this.handleChange}
                />
              </div>
            </div> 
          </div>

          {/* CaratteristicheRifiuto */}
          <div className="form-section">
            <h2>Caratteristiche del Rifiuto</h2>
            <div className="form-group">
              <label>Codice EER:</label>
              <input
                type="text"
                className="form-control"
                name="this.state.formData.DatiFormulario.CaratteristicheRifiuto.CodiceEER"
                value={this.state.formData.DatiFormulario.CaratteristicheRifiuto.CodiceEER || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Denominazione EER:</label>
              <input
                type="text"
                className="form-control"
                name="formData.DatiFormulario.CaratteristicheRifiuto.DenominazioneEER"
                value={this.state.formData.DatiFormulario.CaratteristicheRifiuto.DenominazioneEER || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Descrizione del Rifiuto:</label>
              <input
                type="text"
                className="form-control"
                name="formData.DatiFormulario.CaratteristicheRifiuto.DescrizioneRifiuto"
                value={this.state.formData.DatiFormulario.CaratteristicheRifiuto.DescrizioneRifiuto || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Stato Fisico:</label>
              <input
                type="text"
                className="form-control"
                name="formData.DatiFormulario.CaratteristicheRifiuto.StatoFisico"
                value={this.state.formData.DatiFormulario.CaratteristicheRifiuto.StatoFisico || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Classe di Pericolo:</label>
              <input
                type="text"
                className="form-control"
                name="formData.DatiFormulario.CaratteristicheRifiuto.ClassePericolo"
                value={this.state.formData.DatiFormulario.CaratteristicheRifiuto.ClassePericolo || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Numero Colli:</label>
              <input
                type="text"
                className="form-control"
                name="formData.DatiFormulario.CaratteristicheRifiuto.NumeroColli"
                value={this.state.formData.DatiFormulario.CaratteristicheRifiuto.NumeroColli || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Tipo Imballaggio:</label>
              <input
                type="text"
                className="form-control"
                name="formData.DatiFormulario.CaratteristicheRifiuto.TipoImballaggio"
                value={this.state.formData.DatiFormulario.CaratteristicheRifiuto.TipoImballaggio || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Tipo Imballaggio:</label>
              <input
                type="text"
                className="form-control"
                name="formData.DatiFormulario.CaratteristicheRifiuto.CaratteristicheChimicoFisiche"
                value={this.state.formData.DatiFormulario.CaratteristicheRifiuto.CaratteristicheChimicoFisiche || ''}
                onChange={this.handleChange}
              />
            </div>
          </div>

          {/* DestinazioneRifiuto */}
          <div className="form-section">
            <h2>Destinazione del Rifiuto</h2>
            <div className="form-group">
              <label>Operazione di Recupero:</label>
              <input
                type="text"
                className="form-control"
                name="formData.DatiFormulario.DestinazioneRifiuto.OperazioneRecupero"
                value={this.state.formData.DatiFormulario.DestinazioneRifiuto.OperazioneRecupero || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Operazione di Smaltimento:</label>
              <input
                type="text"
                className="form-control"
                name="formData.DatiFormulario.DestinazioneRifiuto.OperazioneSmaltimento"
                value={this.state.formData.DatiFormulario.DestinazioneRifiuto.OperazioneSmaltimento || ''}
                onChange={this.handleChange}
              />
            </div>
            {/* Altri campi per CaratteristicheChimicoFisiche, ecc. */}
          </div>
          <button type="submit" className="btn btn-primary">
            Invia
          </button>
        </form>
      </div>
    );
  }
}

export default FirForm;
