import React, { Component } from 'react';
import xmlbuilder from 'xmlbuilder'; 

import RegenerationOracle from '../RegenerationOracle/RegenerationOracle';
import '../FirForm/FirForm.css';

class FormDataInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                IdDocumento: null,
                DataCreazione: null,
                Mittente: {
                Ditta: null,
                CodiceFiscale: null,
                PartitaIVA: null,
                Indirizzo: {
                    Paese: null,
                    Comune: null,
                    Provincia: null,
                    Localita: null,
                    Via: null,
                    Civico: null,
                    CAP: null,
                },
                Contatto: {
                    Nome: null,
                    Cognome: null,
                    Telefono: null,
                    Email: null,
                },
                },
                Destinatario: {
                Ditta: null,
                CodiceFiscale: null,
                PartitaIVA: null,
                Indirizzo: {
                    Paese: null,
                    Comune: null,
                    Provincia: null,
                    Localita: null,
                    Via: null,
                    Civico: null,
                    CAP: null,
                },
                Contatto: {
                    Nome: null,
                    Cognome: null,
                    Telefono: null,
                    Email: null,
                },
                },
                Destinazione: {
                Indirizzo: {
                    Paese: null,
                    Comune: null,
                    Provincia: null,
                    Localita: null,
                    Via: null,
                    Civico: null,
                    CAP: null,
                },
                },
                Merce: {
                    Codice: null,
                    Descrizione: null,
                    UM: null,
                    Quantita: null,
                    NColli: null,
                    Peso: null,
                },
                generatedDoc: null,
                prevIdDoc: props.prevIdDoc,
            },
        };
        this.closeInteractionBox = this.closeInteractionBox.bind(this);
    }


    async componentDidMount() {
        this.updateProps(this.props.prevIdDoc);
    }
    
    async componentDidUpdate(prevProps) {
        if (this.props.prevIdDoc !== prevProps.prevIdDoc) {
        this.updateProps(this.props.prevIdDoc);
        }
    }
    
    updateProps(newprevIdDoc) {
        this.setState({ 
        prevIdDoc: newprevIdDoc
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
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let randomLetters = '';
        for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        randomLetters += letters[randomIndex];
        }
    
        const randomNumbers = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
        const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    
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
        prevIdDoc: null
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
                <RegenerationOracle 
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
                </div>
            </form>
        </div>
    );}
}

export default FormDataInput;
