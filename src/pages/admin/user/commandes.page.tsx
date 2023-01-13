import Table, {BinaryValue, fileValue} from '../../../components/Table/Table'
import {getCommandes, updateGlobalStatusCommande, updateStatusCommande} from "../../../services/user.service";

import Icon from "assets/images/user.png"
import {AdminLayout} from 'layouts';
import React from 'react';
import { Spinner } from 'react-activity';
import { Tab, Tabs } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {routes} from 'router/routes';

const columns =  [
    {
        Header: "Nom Complet",
        accessor: 'fullname',
    },
    {
        Header: "Email",
        accessor: 'email',
    },
    {
        Header: "Offre",
        accessor: 'offre_name',
    },
    {
        Header: "Emrys",
        accessor: 'uidEmrys',
        Cell: BinaryValue
    },
    {
        Header: "Dossier",
        accessor: 'file',
        Cell: fileValue
    },
    {
        Header: "N° CPF",
        accessor: 'cpf',
    }
]

const CommandesPage = () => {
    const [commandes, setCommandes] = React.useState([]);
    const [commandesCanceled, setCommandesCanceled] = React.useState([]);
    const [commandesApproved, setCommandesApproved] = React.useState([]);
    const [commandesAbandoned, setCommandesAbandoned] = React.useState([]);

    React.useEffect(() => {
        getAllCommandes();
    }, [])

    const getAllCommandes = async () => {
        getCommandes().then(response => {
            if (response) {
                const commandesAll = [] as any
                const commandesCancel = [] as any
                const commandesApprove = [] as any
                const commandesAbandoned = [] as any
                response.data.map((item: any) => {
                    if(item.status === 'created' && (typeof item.dev !== 'boolean')){
                        commandesAll.push(item)
                    }
                    if(item.status === 'not_validated' && (typeof item.dev !== 'boolean')){
                        commandesCancel.push(item)
                    }
                    if(item.status === 'validated' && (typeof item.dev !== 'boolean')){
                        commandesApprove.push(item)
                    }
                    if(item.status === 'abandoned' && (typeof item.dev !== 'boolean')){
                        commandesAbandoned.push(item)
                    }
                })
                setCommandes(commandesAll)
                setCommandesCanceled(commandesCancel)
                setCommandesApproved(commandesApprove)
                setCommandesAbandoned(commandesAbandoned)
            }
        })
    }

    const cancelCommande = async (commandeBody:any, commandeIndex:any) => {
        if (commandeBody){
            const status = 'not_validated';
            const cancelationCommande = await updateStatusCommande(commandeBody, status)
            if (cancelationCommande && cancelationCommande.status === 200) {
                toast.success('Le dossier a bien été annulé !')
                getAllCommandes()
            }

        }
    }

    const validateCommande = async (commandeBody:any) => {
        if (commandeBody){
            const status = 'validated';
            const cancelationCommande = await updateStatusCommande(commandeBody, status)
            if (cancelationCommande && cancelationCommande.status === 200) {
                toast.success('Le dossier a bien été validé !')
                getAllCommandes()
            }

        }
    }

    const validateFinalCommande = async (commandeBody:any) => {
        if (commandeBody){
            const status = 'fulfilled';
            const cancelationCommande = await updateStatusCommande(commandeBody, status)
            if (cancelationCommande && cancelationCommande.status === 200) {
                toast.success('Le dossier a bien été validé !')
                getAllCommandes()
            }

        }
    }

    const abandonedCommand = async (commandeBody:any) => {
        if (commandeBody){
            const status = 'abandoned';
            const cancelationCommande = await updateGlobalStatusCommande(commandeBody, status)
            if (cancelationCommande && cancelationCommande.status === 200) {
                toast.success('Le dossier a bien été abandonné !')
                getAllCommandes()
            }
        }
    }

    return (
        <AdminLayout>
            <div className="row">
                <div className="col-lg-9 d-flex d-flex-middle">
                    <h2 className="text-grey-900 font-md fw-700">Dossiers d'Inscriptions aux Formations </h2>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-12'>
                    <p>
                        Gérer tous les dossiers d'Inscription CPF depuis un seul endroit !
                    </p>
                </div>
            </div>

            <Tabs
                defaultActiveKey='1'
                className="nav nav-tabs list-inline product-info-tab profile mb-4"
            >
                <Tab eventKey='1' title='Dossiers Créés'>
                    {commandes.length > 0 ? (
                        <Table columns={columns} data={commandes.length > 0 ? commandes : []} actionCommandes cancelCommande={cancelCommande} validateCommande={validateCommande}/> 
                    ): 'Aucun Nouveau Dossier reçu pour le Moment'}
                </Tab>
                <Tab eventKey='2' title='Dossiers Annulés'>
                    {commandesCanceled.length > 0 ? (
                        <Table columns={columns} data={commandesCanceled.length > 0 ? commandesCanceled : []} noActions danger/> 
                    ): 'Aucun Dossier Annulé'}
                </Tab>
                <Tab eventKey='3' title='Dossiers Validés'>
                    {commandesApproved.length > 0 ? (
                        <Table columns={columns} data={commandesApproved.length > 0 ? commandesApproved : []} actionCommandes actionFinalCommandes validateFinalCommande={validateFinalCommande} abandonedCommand={abandonedCommand} success/> 
                    ): 'Aucun Dossier Validé'}
                </Tab>
                <Tab eventKey='4' title='Dossiers Abandonnés'>
                    {commandesAbandoned.length > 0 ? (
                        <Table columns={columns} data={commandesAbandoned.length > 0 ? commandesAbandoned : []} noActions/> 
                    ): 'Aucun Dossier Validé'}
                </Tab>
            </Tabs>
            
        </AdminLayout>
    );
};

export {CommandesPage};
