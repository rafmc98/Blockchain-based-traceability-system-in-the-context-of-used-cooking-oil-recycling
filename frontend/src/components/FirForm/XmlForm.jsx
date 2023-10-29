import React, { Component } from 'react';

class XmlForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Versione: null,
      IdDocumento: null,
      DataCreazione: null,
      Autore: {
        IdSoftware: null,
        EmailURI: null,
        VersioneSoftware: null,
      },
      DatiFormulario: {
        DataEmissione: null,
        NumeroFormulario: null,
        ProduttoreDetentore: {
          CodiceFiscale: {
            paeseId: null,
            value: null,
          },
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
          CodiceFiscale: {
            paeseId: null,
            value: null,
          },
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
            CodiceFiscale: {
              paeseId: null,
              value: null,
            },
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
          ClassiPericolo: {
            ClassePericolo: null,
          },
          NumeroColli: null,
          TipoImballaggio: null,
          CaratteristicheChimicoFisiche: null,
        },
        DestinazioneRifiuto: {
          OperazioneRecupero: null,
          OperazioneSmaltimento: null,
        }
      }
    };  

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleArrayInputChange = this.handleArrayInputChange.bind(this);
    this.handleNestedInputChange = this.handleNestedInputChange.bind(this);

  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleNestedInputChange = (event, parentField, childField) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      [parentField]: {
        ...prevState[parentField],
        [childField]: value,
      },
    }));
  };

  handleArrayInputChange = (event, parentField, arrayField, index) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      [parentField]: {
        ...prevState[parentField],
        [arrayField]: prevState[parentField][arrayField].map((item, i) =>
          i === index ? { ...item, [name]: value } : item
        ),
      },
    }));
  };

  handleSubmit = (event) => {
    event.preventDefault();
    // Qui puoi gestire la creazione del documento XML utilizzando i dati in this.state
  };

  render() {
    return (
     <></>
  }
}

export default XmlForm;
