import React, { Component } from 'react';
import xmlbuilder from 'xmlbuilder'; 
import { useTranslation } from 'react-i18next';

import Oracle from '../Oracle/Oracle';

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

          DatiTrasporto: {
              idRef: null,
              Conducente: {
                Nome: null,
                Cognome: null
              },
              TargaAutomezzo: null,
              TargaRimorchio: null,
              DataInizioTrasporto: null,
              OraInizioTrasporto: null
          },
          DatiAccettazione: {
            AccettazioneCompleta: null,
            QuantitaAccettata: null,
            MotivazioniRespingimento: null,
            DataAccettazione: null,
            OraAccettazione: null,
            Annotazioni: null,
            IdentificativoFirmatario: null,
            DataFirma: null
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
          },
      
        }
      },
      generatedDoc: null,
      prevRfj: props.prevRfj,
    };
    this.closeInteractionBox = this.closeInteractionBox.bind(this);
  }

  async componentDidMount() {
    this.updateProps(this.props.prevRfj);
  }

  async componentDidUpdate(prevProps) {
    if (this.props.prevRfj !== prevProps.prevRfj) {
      this.updateProps(this.props.prevRfj);
    }
  }

  updateProps(newPrevRfj) {
    this.setState({ 
      prevRfj: newPrevRfj
    });
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

  generateIdDoc = () => {
    // Genera una stringa casuale di 5 lettere maiuscole
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomLetters = '';
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      randomLetters += letters[randomIndex];
    }
  
    // Genera una stringa casuale di 6 cifre
    const randomNumbers = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  
    // Genera una lettera casuale
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
  
    // Combina le parti per formare la stringa completa
    const randomString = `${randomLetters} ${randomNumbers} ${randomLetter}`;
  
    return randomString;
  }

  updateAutomatedFields = async () => {
    const date = new Date();
    let currentDay = String(date.getDate()).padStart(2, '0');
    let currentMonth = String(date.getMonth() + 1).padStart(2, '0');
    let currentYear = date.getFullYear();
    let currentDate = `${currentDay}-${currentMonth}-${currentYear}`;

    let idDocumento = this.generateIdDoc();

    this.setState((prevState) => {

      const formData = { ...prevState.formData };
      formData.DataCreazione = currentDate;
      formData.IdDocumento = idDocumento;

      const datiFormulario = { ...formData.DatiFormulario };
      datiFormulario.DataEmissione = currentDate;

      formData.DatiFormulario = datiFormulario;

      return { formData };
    }, () => {
      console.log(this.state);
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    
    await this.updateAutomatedFields();

    const xml = xmlbuilder.create('formData');
    this.buildXML(this.state.formData, xml);
    const xmlString = xml.end({ pretty: true });
    const blob = new Blob([xmlString], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formData.xml';
    a.click();

    this.setState({
      generatedDoc: xmlString
    })
    window.URL.revokeObjectURL(url);
  };

  buildXML = (obj, parent) => {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        const child = parent.ele(key);
        this.buildXML(obj[key], child);
      } else {
        parent.ele(key, obj[key].toString());
      }
    }
  };

  closeInteractionBox() {
    this.setState({
      generatedDoc: null,
      prevRfj: null
    });
  }

  render() {
    return (
      <div className="formContainer">
        {this.state.generatedDoc && (
            <div className="overlay">
            <div className="transactionMessageBox">
              <h3>{this.props.t("firGeneratedTitle")}</h3>
              <div>
                <p>
                    <span>
                      {this.props.t("generatedId")} 
                    </span>
                    {this.state.formData.IdDocumento}
                </p>
                {this.state.prevRfj && 
                  <p>
                    <span>
                      {this.props.t("previousLinked")} 
                    </span>
                    {this.state.prevRfj} 
                  </p>
                }
              </div>
              <Oracle 
                fileToUpload={this.state.generatedDoc}
                prevRfj={this.state.prevRfj}
                t={this.props.t}
              />
              <span className="closeBox" onClick={this.closeInteractionBox}>x</span>
            </div>
         </div>
        )}

        <form onSubmit={this.handleSubmit}>
          
          {/* Produttore Detentore */}
          <div className="form-section">
            <h2>Produttore/Detentore</h2>
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
                className="input-small"
                placeholder="Comune"
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
              <input
                type="text"
                className="input-small"
                placeholder="Scala"
                name="formData.DatiFormulario.ProduttoreDetentore.Indirizzo.NumeroScala"
                value={this.state.formData.DatiFormulario.ProduttoreDetentore.Indirizzo.NumeroScala || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-small"
                placeholder="Piano"
                name="formData.DatiFormulario.ProduttoreDetentore.Indirizzo.NumeroPiano"
                value={this.state.formData.DatiFormulario.ProduttoreDetentore.Indirizzo.NumeroPiano || ''}
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
                className="input-medium"
                placeholder="Cognome"
                name="formData.DatiFormulario.ProduttoreDetentore.Contatto.Cognome"
                value={this.state.formData.DatiFormulario.ProduttoreDetentore.Contatto.Cognome || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-medium"
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
          
          <hr className="dotted-line"/>
          
          {/* Destinatario */}
          <div className="form-section">
            <h2>Destinatario</h2>
            <div className="form-group">
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Destinatario.CodiceFiscale"
                placeholder="Codice Fiscale"
                value={this.state.formData.DatiFormulario.Destinatario.CodiceFiscale || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-large"
                name="formData.DatiFormulario.Destinatario.Denominazione"
                placeholder="Denominazione"
                value={this.state.formData.DatiFormulario.Destinatario.Denominazione || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <h3 className='group-title'>Indirizzo</h3>
              <input
                type="text"
                className="input-small"
                name="formData.DatiFormulario.Destinatario.Indirizzo.Paese.id"
                placeholder="Paese ID"
                value={this.state.formData.DatiFormulario.Destinatario.Indirizzo.Paese.id || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-small"
                name="formData.DatiFormulario.Destinatario.Indirizzo.Comune.istat"
                placeholder="Comune"
                value={this.state.formData.DatiFormulario.Destinatario.Indirizzo.Comune.istat || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-small"
                name="formData.DatiFormulario.Destinatario.Indirizzo.Provincia"
                placeholder="Provincia"
                value={this.state.formData.DatiFormulario.Destinatario.Indirizzo.Provincia || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Destinatario.Indirizzo.Localita"
                placeholder="Localita"
                value={this.state.formData.DatiFormulario.Destinatario.Indirizzo.Localita || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-large"
                name="formData.DatiFormulario.Destinatario.Indirizzo.Via"
                placeholder="Via"
                value={this.state.formData.DatiFormulario.Destinatario.Indirizzo.Via || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-small"
                name="formData.DatiFormulario.Destinatario.Indirizzo.Civico"
                placeholder="Civico"
                value={this.state.formData.DatiFormulario.Destinatario.Indirizzo.Civico || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-small"
                name="formData.DatiFormulario.Destinatario.Indirizzo.CAP"
                placeholder="CAP"
                value={this.state.formData.DatiFormulario.Destinatario.Indirizzo.CAP || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-small"
                name="formData.DatiFormulario.Destinatario.Indirizzo.NumeroScala"
                placeholder="Scala"
                value={this.state.formData.DatiFormulario.Destinatario.Indirizzo.NumeroScala || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-small"
                name="formData.DatiFormulario.Destinatario.Indirizzo.NumeroPiano"
                placeholder="Piano"
                value={this.state.formData.DatiFormulario.Destinatario.Indirizzo.NumeroPiano || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <h3 className='group-title'>Contatto</h3>
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Destinatario.Contatto.Nome"
                placeholder="Nome"
                value={this.state.formData.DatiFormulario.Destinatario.Contatto.Nome || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Destinatario.Contatto.Cognome"
                placeholder="Cognome"
                value={this.state.formData.DatiFormulario.Destinatario.Contatto.Cognome || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Destinatario.Contatto.Telefono"
                placeholder="Telefono"
                value={this.state.formData.DatiFormulario.Destinatario.Contatto.Telefono || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-large"
                name="formData.DatiFormulario.Destinatario.Contatto.Email"
                placeholder="Email"
                value={this.state.formData.DatiFormulario.Destinatario.Contatto.Email || ''}
                onChange={this.handleChange}
              />
            </div>
          </div>
          
          <hr className="dotted-line"/>
          
          {/* Trasportatori */}
          <div className="form-section">
            <h2>Trasportatore</h2>
            <div className="form-group">
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.id"
                placeholder="ID Trasportatore"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.id || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.CodiceFiscale"
                placeholder="Codice Fiscale"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.CodiceFiscale || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-large"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Denominazione"
                placeholder="Denominazione"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Denominazione || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <h3 className='group-title'>Indirizzo</h3>
              <input
                type="text"
                className="input-small"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Paese.id"
                placeholder="ID Paese"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Paese.id || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-small"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Comune.istat"
                placeholder="Comune"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Comune.istat || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-small"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Provincia"
                placeholder="Provincia"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Provincia || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Localita"
                placeholder="Località"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Localita || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-large"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Via"
                placeholder="Via"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Via || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-small"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Civico"
                placeholder="Civico "
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.Civico || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-small"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.CAP"
                placeholder="CAP"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.CAP || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-small"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.NumeroScala"
                placeholder="Scala"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.NumeroScala || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-small"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.NumeroPiano"
                placeholder="Piano"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Indirizzo.NumeroPiano || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <h3 className='group-title'>Contatto</h3>
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Contatto.Nome"
                placeholder="Nome"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Contatto.Nome || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Contatto.Cognome"
                placeholder="Cognome"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Contatto.Cognome || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Contatto.Telefono"
                placeholder="Telefono"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Contatto.Telefono || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-large"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.Contatto.Email"
                placeholder="Email"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.Contatto.Email || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <h3 className='group-title'>Autorizzazione Albo</h3>
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.AutorizzazioneAlbo.NumeroIscrizione"
                placeholder="Numero Iscrizione Albo"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.AutorizzazioneAlbo.NumeroIscrizione || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.Trasportatori.Trasportatore.AutorizzazioneAlbo.DataIscrizione"
                placeholder="Data Iscrizione Albo"
                value={this.state.formData.DatiFormulario.Trasportatori.Trasportatore.AutorizzazioneAlbo.DataIscrizione || ''}
                onChange={this.handleChange}
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => e.target.type = 'text'}
              />
            </div>
          </div>
          
          <hr className="dotted-line"/>
          
          {/* DatiTrasporto */}
          <div className='form-section'>
            <h2>Trasportatore</h2>
            <div className='form-group'>
              <input
                type="number"
                className="input-medium"
                placeholder="ID Trasporto"
                name="formData.DatiFormulario.DatiTrasporto.idRef"
                value={this.state.formData.DatiFormulario.DatiTrasporto.idRef || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className='form-group'>
              <h3 className='group-title'>Conducente</h3>
              <input
                type="text"
                className="input-medium"
                placeholder="Nome"
                name="formData.DatiFormulario.DatiTrasporto.Conducente.Nome"
                value={this.state.formData.DatiFormulario.DatiTrasporto.Conducente.Nome || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-medium"
                placeholder="Cognome"
                name="formData.DatiFormulario.DatiTrasporto.Conducente.Cognome"
                value={this.state.formData.DatiFormulario.DatiTrasporto.Conducente.Cognome || ''}
                onChange={this.handleChange}
              />
            </div>
            <div className='form-group'>      
              <input
                type="text"
                className="input-medium"
                placeholder="Targa dell'Automezzo"
                name="formData.DatiFormulario.DatiTrasporto.TargaAutomezzo"
                value={this.state.formData.DatiFormulario.DatiTrasporto.TargaAutomezzo || ''}
                onChange={this.handleChange}
              />

              <input
                type="text"
                className="input-medium"
                placeholder="Targa del Rimorchio"
                name="formData.DatiFormulario.DatiTrasporto.TargaRimorchio"
                value={this.state.formData.DatiFormulario.DatiTrasporto.TargaRimorchio || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-medium"
                placeholder="Data di Inizio del Trasporto"
                name="formData.DatiFormulario.DatiTrasporto.DataInizioTrasporto"
                value={this.state.formData.DatiFormulario.DatiTrasporto.DataInizioTrasporto || ''}
                onChange={this.handleChange}
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => e.target.type = 'text'}
              />
              <input
                type="text"
                className="input-medium"
                placeholder="Ora di Inizio del Trasporto"
                name="formData.DatiFormulario.DatiTrasporto.OraInizioTrasporto"
                value={this.state.formData.DatiFormulario.DatiTrasporto.OraInizioTrasporto || ''}
                onChange={this.handleChange}
                onFocus={(e) => e.target.type = 'time'}
                onBlur={(e) => e.target.type = 'text'}
              />
            </div>
          </div>
        
          <hr className="dotted-line"/>

          {/* DatiAccettazione */}
          <div className='form-section'>
            <h2>Dati Accettazione</h2>
            <div className='form-group'>
              <select
                className="input-medium"
                name="formData.DatiFormulario.DatiAccettazione.AccettazioneCompleta"
                defaultValue={this.state.formData.DatiFormulario.DatiAccettazione.AccettazioneCompleta || 'A'}
                onChange={this.handleChange}
              >
                <option value="" disabled selected>Accettazione Rifiuto</option>
                <option value="A">Accettato per intero</option>
                <option value="AP">Accettato parzialmente</option>
                <option value="R">Respinto</option>
              </select>
              <input
                type="number"
                className="input-small"
                placeholder="Qta"
                name="formData.DatiFormulario.DatiAccettazione.QuantitaAccettata"
                value={this.state.formData.DatiFormulario.DatiAccettazione.QuantitaAccettata || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-medium"
                placeholder="Motivazioni Respignimento"
                name="formData.DatiFormulario.DatiAccettazione.MotivazioniRespingimento"
                value={this.state.formData.DatiFormulario.DatiAccettazione.MotivazioniRespingimento || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-small"
                name="formData.DatiFormulario.DatiAccettazione.DataAccettazione"
                value={this.state.formData.DatiFormulario.DatiAccettazione.DataAccettazione || ''}
                onChange={this.handleChange}
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => e.target.type = 'text'}
                placeholder="Data"
              />
              <input
                type="text"
                className="input-small"
                name="formData.DatiFormulario.DatiAccettazione.OraAccettazione"
                value={this.state.formData.DatiFormulario.DatiAccettazione.OraAccettazione || ''}
                onChange={this.handleChange}
                onFocus={(e) => e.target.type = 'time'}
                onBlur={(e) => e.target.type = 'text'}
                placeholder="Ora"
              />
              <input
                type="text"
                className="input-medium"
                placeholder="Annotazioni"
                name="formData.DatiFormulario.DatiAccettazione.Annotazioni"
                value={this.state.formData.DatiFormulario.DatiAccettazione.Annotazioni || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-medium"
                placeholder="Identificativo del Firmatario"
                name="formData.DatiFormulario.DatiAccettazione.IdentificativoFirmatario"
                value={this.state.formData.DatiFormulario.DatiAccettazione.IdentificativoFirmatario || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-small"
                placeholder="Data Firma"
                name="formData.DatiFormulario.DatiAccettazione.DataFirma"
                value={this.state.formData.DatiFormulario.DatiAccettazione.DataFirma || ''}
                onChange={this.handleChange}
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => e.target.type = 'text'}
              />
            </div>
          </div>
          
          <hr className="dotted-line"/>

          {/* CaratteristicheRifiuto */}
          <div className="form-section">
            <h2>Caratteristiche del Rifiuto</h2>
            <div className="form-group">
              <input
                type="number"
                className="input-medium"
                name="formData.DatiFormulario.CaratteristicheRifiuto.CodiceEER"
                placeholder="Codice EER"
                value={this.state.formData.DatiFormulario.CaratteristicheRifiuto.CodiceEER || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-large"
                name="formData.DatiFormulario.CaratteristicheRifiuto.DenominazioneEER"
                placeholder="Denominazione EER"
                value={this.state.formData.DatiFormulario.CaratteristicheRifiuto.DenominazioneEER || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-large"
                name="formData.DatiFormulario.CaratteristicheRifiuto.DescrizioneRifiuto"
                placeholder="Descrizione"
                value={this.state.formData.DatiFormulario.CaratteristicheRifiuto.DescrizioneRifiuto || ''}
                onChange={this.handleChange}
              />
              <select
                className="input-medium"
                name="formData.DatiFormulario.CaratteristicheRifiuto.StatoFisico"
                value={this.state.formData.DatiFormulario.CaratteristicheRifiuto.StatoFisico || ''}
                onChange={this.handleChange}
              >
                <option value="" disabled selected>Stato Fisico</option>
                <option value="SP">Pulverulento</option>
                <option value="SNP">Solido</option>
                <option value="FP">Fangoso</option>
                <option value="L">Liquido</option>
              </select>

              <select
                className="input-medium"
                name="formData.DatiFormulario.CaratteristicheRifiuto.ClassePericolo"
                value={this.state.formData.DatiFormulario.CaratteristicheRifiuto.ClassePericolo || ''}
                onChange={this.handleChange}
              >
                <option value="" disabled selected>Seleziona una classe di pericolo</option>
                <option value="HP01">HP01</option>
                <option value="HP02">HP02</option>
                <option value="HP03">HP03</option>
                <option value="HP04">HP04</option>
                <option value="HP05">HP05</option>
                <option value="HP06">HP06</option>
                <option value="HP07">HP07</option>
                <option value="HP08">HP08</option>
                <option value="HP09">HP09</option>
                <option value="HP10">HP10</option>
                <option value="HP11">HP11</option>
                <option value="HP12">HP12</option>
                <option value="HP13">HP13</option>
                <option value="HP14">HP14</option>
                <option value="HP15">HP15</option>
              </select>
              <input
                type="number"
                className="input-medium"
                name="formData.DatiFormulario.CaratteristicheRifiuto.NumeroColli"
                placeholder="Numero di Colli"
                value={this.state.formData.DatiFormulario.CaratteristicheRifiuto.NumeroColli || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-medium"
                name="formData.DatiFormulario.CaratteristicheRifiuto.TipoImballaggio"
                placeholder="Tipo di Imballaggio"
                value={this.state.formData.DatiFormulario.CaratteristicheRifiuto.TipoImballaggio || ''}
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input-large"
                name="formData.DatiFormulario.CaratteristicheRifiuto.CaratteristicheChimicoFisiche"
                placeholder="Caratteristiche Chimico-Fisiche"
                value={this.state.formData.DatiFormulario.CaratteristicheRifiuto.CaratteristicheChimicoFisiche || ''}
                onChange={this.handleChange}
              />
            </div>
          </div>
          
          <hr className="dotted-line"/>
          
          {/* DestinazioneRifiuto */}
          <div className="form-section">
            <h2>Destinazione del Rifiuto</h2>
            <div className="form-group">
              <select
                className="input-large"
                name="formData.DatiFormulario.DestinazioneRifiuto.OperazioneRecupero"
                value={this.state.formData.DatiFormulario.DestinazioneRifiuto.OperazioneRecupero || ''}
                onChange={this.handleChange}
              >
                <option value="" disabled selected>Operazione Recupero</option>
                <option value="R1">R1</option>
                <option value="R2">R2</option>
                <option value="R3">R3</option>
                <option value="R4">R4</option>
                <option value="R5">R5</option>
                <option value="R6">R6</option>
                <option value="R7">R7</option>
                <option value="R8">R8</option>
                <option value="R9">R9</option>
                <option value="R10">R10</option>
                <option value="R11">R11</option>
                <option value="R12">R12</option>
                <option value="R13">R13</option>
              </select>
              <select
                className="input-large"
                name="formData.DatiFormulario.DestinazioneRifiuto.OperazioneSmaltimento"
                value={this.state.formData.DatiFormulario.DestinazioneRifiuto.OperazioneSmaltimento || ''}
                onChange={this.handleChange}
              >
                <option value="" disabled selected>Operazione Smaltimento</option>
                <option value="D1">D1</option>
                <option value="D2">D2</option>
                <option value="D3">D3</option>
                <option value="D4">D4</option>
                <option value="D5">D5</option>
                <option value="D6">D6</option>
                <option value="D7">D7</option>
                <option value="D8">D8</option>
                <option value="D9">D9</option>
                <option value="D10">D10</option>
                <option value="D11">D11</option>
                <option value="D12">D12</option>
                <option value="D13">D13</option>
                <option value="D14">D14</option>
                <option value="D15">D15</option>
              </select>
            </div>
          </div>

          <button type="submit" className="load-button">
            Genera xFir
          </button>
        </form>
      </div>
    );
  }
}

export default FirForm;
