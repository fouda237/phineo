import {inscriptionCourseEmail} from '../services/user.service'

import axios from "axios";
import { useAuthContext } from "context";
import { AdminLayout } from 'layouts';
import React, {useState} from 'react';
import { Spinner } from "react-activity";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import authService from "services/auth.service"
import {createViewLog} from "services/user.service";


interface Inputs {
    email: string,
    fullname: string,
    cpf: string,
    file: string,
    temps: string,
    offre: string,
    message: string,
}

const offres =  [
  {
      code: "WORDPRESS",
      title: 'Formation: Créer et administrer un site web avec WordPress',
      description: 'WordPress est le CMS le plus utilisé dans le monde avec plus de deux tiers de parts de marché détenues. Il permet de concevoir tous types de site web sans réelles connaissances techniques.',
      price: 179700,
  },
  {
      code: "PACK-OFFICE",
      title: 'Formation: Microsoft Pack Office',
      description: 'Cette formation a pour objectif d’apprendre l’utilisation des fonctionnalités de base et intermédiaires des trois principaux logiciels de la suite Microsoft Office : Word, Powerpoint et Excel.',
      price: 159700,
  },
  {
      code: "EXCEL-BASE",
      title: 'Formation: Microsoft Office : Excel - Bases',
      description: "Cette formation vous permettra d'apprendre les fonctionnalités de base et intermédiaires du logiciel Excel afin de gagner en efficacité dans votre travail et d’être capable de réaliser des tableurs répondant à la plupart de vos besoins bureautiques.",
      price: 99700,
  },
  {
      code: "EXCEL-BASES",
      title: 'Formation: Microsoft Office : Excel - Bases',
      description: "Cette formation vous permettra d'apprendre les fonctionnalités de base et intermédiaires du logiciel Excel afin de gagner en efficacité dans votre travail et d’être capable de réaliser des tableurs répondant à la plupart de vos besoins bureautiques.",
      price: 99700,
  },
  {
      code: "EXCEL-AVANCE",
      title: 'Formation: Microsoft Office : Excel - Avancé',
      description: "Cette formation vous permettra d'apprendre les fonctionnalités de base, intermédiaires et avancées des logiciels Excel et Power Bi ainsi que les fonctions VBA d'Excel afin de gagner en efficacité et en productivité dans votre travail.",
      price: 184700,
  },
  {
      code: "EXCEL-ACCOMPAGNEMENT",
      title: 'Formation: Microsoft Office : Excel - Option Accompagnement',
      description: "Cette formation vous permettra d'apprendre les fonctionnalités de base, intermédiaires et avancées des logiciels Excel et Power Bi ainsi que les fonctions VBA d'Excel afin de gagner en efficacité et en productivité dans votre travail.",
      price: 234700,
  },
  {
      code: "WORD",
      title: 'Formation: Microsoft Office : Word',
      description: "Dans cette formation, vous apprendrez à utiliser les fonctionnalités de base et intermédiaires du logiciel de traitement de texte Microsoft Office Word afin de gagner en productivité et en efficacité dans la rédaction de vos documents.",
      price: 49700,
  },
  {
      code: "POWERPOINT",
      title: 'Formation: Microsoft Office : Powerpoint',
      description: "Dans cette formation, vous apprendrez à utiliser les fonctionnalités de base et intermédiaires du logiciel Microsoft Office PowerPoint pour gagner en efficacité et en performance dans l'édition de vos présentations.",
      price: 49700,
  },
  {
      code: "CREATION-ENTREPRISE",
      title: "Formation: Création d'Entreprise",
      description: "Cette formation vous permettra de vous préparer à la création ou la reprise d’une entreprise. Elle vous permettra de choisir le statut le plus adapté à votre projet et d’analyser votre marché afin de créer un projet pérenne.",
      price: 49700,
  },
  {
      code: "CREATION-GESTION-ENTREPRISE",
      title: "Formation: Création et Gestion d'Entreprise",
      description: "Cette formation vous permettra de vous préparer à la création ou à la reprise d’une entreprise et vous donnera toutes les clés nécessaires à sa gestion et à sa pérennisation.",
      price: 189700,
  },
  {
      code: "CREATION-ENTREPRISE-ACCOMPAGNEMENT",
      title: "Formation: Création et Gestion d'Entreprise - Option Accompagnement",
      description: "Cette formation vous permettra de vous préparer à la création ou à la reprise d’une entreprise et vous donnera toutes les clés nécessaires à sa gestion et à sa pérennisation.",
      price: 319700,
  },
  {
      code: "OUTILS-COLLABORATIFS",
      title: "Formation: Outils Collaboratifs",
      description: "Cette formation vous permettra d’utiliser efficacement un ensemble d’outils puissants et gratuits destinés au travail en équipe.",
      price: 119700,
  },
  {
      code: "PHOTOSHOP",
      title: "Formation: Adobe Photoshop",
      description: "Cette formation a pour objectif d’apprendre et de maîtriser l’utilisation du logiciel de création graphique et de retouche d’images Photoshop.",
      price: 144700,
  },
  {
      code: "TEST",
      title: 'Formation: Word',
      description: 'WordPress est le CMS le plus utilisé dans le monde avec plus de deux tiers de parts de marché détenues. Il permet de concevoir tous types de site web sans réelles connaissances techniques.',
      price: 150,
  },
]

const InscriptionCourse = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const authContext = useAuthContext()
  const navigate = useNavigate();
  const [offreIndex, setOffreIndex] = useState<number>()

  React.useEffect(() => {
    if (queryParams.get('offre') === null){
      navigate('/')
    } else {
      for(let i = 0; i < offres.length; i++) {
        if (queryParams.get('offre') === offres[i].code){
          setOffreIndex(i)
        }
      }
    }

    createViewLog('inscription-course')
  }, [])

    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    const [isSend, setIsSend] = useState(false);
    const [error, setError] = useState(false);
    const [fileRequired, setFileRequired] = useState(false);
    const [fileRequiredLoaded, setFileRequiredLoaded] = useState(false);
    const [fileLoading, setFileLoading] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [filePath, setFilePath] = React.useState<any>();
    const [fileUploaded, setFileUploaded] = React.useState(false);
    const [fileUploadError, setFileUploadError] = React.useState(false);
    const [canSubmit, setCanSubmit] = useState(true);
    const onSubmit = handleSubmit(async (data) => { 
      if (offreIndex != null || offreIndex != undefined){
        setLoading(true)

        const supportMessage = await inscriptionCourseEmail({
            email: data.email,
            fullname: data.fullname,
            cpf: data.cpf,
            temps: data.temps,
            file: data.file,
            offre: offres[offreIndex].code,
            offre_name: offres[offreIndex].title,
            offre_description: offres[offreIndex].description,
            offre_price: offres[offreIndex].price,
            userId: authContext.authState.user.id
        })

        if (supportMessage && supportMessage.status === 201) {
            setError(false);
            setIsSend(true);
            setLoading(false)
        } else if (supportMessage && (supportMessage.status > 400 || supportMessage === 'Emrys Reconnexion is Required')) {
            setError(true);
            setLoading(false)
        }
      }
    });

    if ((queryParams.get('offre') !== 'TESTAAA') && !fileRequiredLoaded){
      setFileRequired(true)
      setCanSubmit(false)
      setFileRequiredLoaded(true)
    }    



    const fileSubmit = async (file:any) => {    
      if (file){
          setFileLoading(true)

          const dataForm = new FormData()
          dataForm.append('file', file)

          const user = authService.getCurrentUser()
          if (!user) return;

          try {
                  return await axios.post(`${process.env.REACT_APP_API_FILE_URL}/upload/file`, dataForm, {
                  headers: {
                      "Content-Type": "multipart/form-data",
                      Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
                  }
              }).then ((res) => {
                
                  register("file", { 
                    value: res.data
                  })

                  setFileLoading(false)
                  setFileUploadError(false)
                  setFileUploaded(true)
                  setCanSubmit(true)
              })
          } catch (e) {
                  setFileLoading(false)
                  setFileUploadError(true)
                  setFileUploaded(false)
              }
          }
  };

    return (
        <AdminLayout>

            
        <div className="map-wrapper pt-lg--8 pt-3 pb-3">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="contact-wrap card bg-white shadow-lg rounded-lg position-relative top-0">
                  <h1 className="text-grey-900 fw-700  font-xl mb-2 lh-1">
                    Inscrivez-vous à votre Prochaine Formation !
                  </h1>
                  <h1 className="text-grey-900 fw-500  font-lg mb-2 lh-1">
                    {offreIndex != null && offres[offreIndex].title }
                  </h1>
                  <p className="text-grey-600 mb-4 font-xsss lh-4">
                      Une Nouvelle connaissance vous attend maintenant !
                  </p>
                  
                  { loading ? (
                      <div className='mt-2 mb-4' style={{ display: 'flex', alignItems: 'center'}}>
                          <Spinner /> <p className='mb-0 ml-3'>Envoi du Formulaire en cours ... </p>
                      </div>
                    ) : (
                      !isSend ? (
                        <form onSubmit={onSubmit}>
                          <div className="row">
                            <div className="col-md-12">
                                <label
                                      className="form-label"
                                  >
                                      Vos Informations :
                                </label>
                            </div>
                            <div className="col-lg-6 col-md-12">
                              <div className="form-group mb-3">
                                <input
                                  {...register("fullname", { required: true })}
                                  type="text"
                                  className="form-control style2-input bg-color-none text-grey-700"
                                  placeholder="Votre Nom *"
                                  value={authContext.authState.user.firstName + ' ' + authContext.authState.user.lastName}
                                  readOnly
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-12">
                              <div className="form-group mb-3">
                                <input
                                  {...register("email", { required: true })}
                                  type="text"
                                  className="form-control style2-input bg-color-none text-grey-700"
                                  placeholder="Votre Email *"
                                  value={authContext.authState.user.email}
                                  readOnly
                                  required
                                />
                              </div>
                            </div>

                            <div className="col-12">
                              <div className="form-group mb-3 md-mb-2">
                                <input
                                  {...register("cpf", { required: true })}
                                  type="text"
                                  className="form-control style2-input bg-color-none text-grey-700"
                                  placeholder="Votre Numéro de Dossier CPF *"
                                  required
                                />
                              </div>
                            </div>

                            {fileRequired && (
                              <>
                                <div className="col-md-12">
                                    <label
                                          className="form-label"
                                      >
                                          Votre document officiel à renvoyer *
                                    </label>
                                </div>

                                <div className='col-md-12'>
                                  <div className="form-group mb-3 md-mb-2">
                                    <input 
                                        onChange={(e:any) => fileSubmit(e.target.files[0])}
                                        className='form-control form_control mb-3' 
                                        type="file" 
                                        required
                                    />
                                    {(fileLoading && !fileUploaded && !fileUploadError) && (
                                        <div className='mt-2 mb-4' style={{ display: 'flex', alignItems: 'center'}}>
                                            <Spinner /> <p className='mb-0 ml-3'>Téléchargement en cours ... </p>
                                        </div>
                                    )}
                                    {
                                        (fileUploaded && !fileUploadError) && (
                                            <p className='text-success lh-3'> <i className="feather-check mr-2"></i> 
                                                Votre Fichier a bien été téléchargé !  <br />Vous pouvez dès maintenant vous inscrire à cette formation !
                                            </p>
                                        )
                                    }
                                    {
                                        (!fileUploaded && fileUploadError) && (
                                            <p className='text-danger lh-3'> <i className="feather-x mr-2"></i> 
                                                Un Problème est survenu et votre fichier n'a pas été envoyé ... <br/> Assurez-vous que le format soit correct et qu'il ne dépasse pas les 50Mo
                                            </p>
                                        )
                                    }
                                  </div>
                                </div>
                              </>
                            )}

                            <div className="col-md-12">
                                <label
                                      className="form-label"
                                  >
                                      Quand souhaitez-vous Démarrer cette Formation ?
                                </label>
                            </div>

                            <div className="col-12">
                              <div className="form-group mb-3 md-mb-2">
                                  <select 
                                      {...register("temps", { required: true })}
                                      className="form-control form_control"
                                  >
                                      <option value={"Le Plus Rapidement Possible"}>
                                          Le Plus Rapidement Possible
                                      </option>
                                      <option value={"1 à 3 Semaines"}>
                                          1 à 3 Semaines
                                      </option>
                                      <option value={"3 à 5 Semaines"}>
                                          3 à 5 Semaines
                                      </option>
                                      <option value={"5 Semaines ou +"}>
                                        5 Semaines ou +
                                      </option>
                                  </select>
                              </div>
                            </div>

                            <div className="col-md-12">
                              {error && (
                                <p className="text-danger">Un Problème est arrivé, merci de réessayer dans quelques instants ... <br /> Une petite Deconnexion de votre compte puis une Reconnexion devrait faire l'affaire ;)</p>
                              )}
                              <div className="form-group">
                                {canSubmit ? (
                                  <button
                                    type="submit"
                                    className="rounded-xl style1-input float-left bg-current text-white text-center font-xss fw-500 border-0 pl-5 pr-5"
                                  >
                                    M'Inscrire à cette Formation !
                                  </button>
                                ) : (
                                  <button
                                    className="rounded-xl style1-input float-left bg-current text-white text-center font-xss fw-500 border-0 pl-5 pr-5"
                                  >
                                    M'Inscrire à cette Formation !
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </form>
                      ) : (
                        <h2>
                          <i className='feather feather-check mr-3 text-success'/>
                            Votre Demande d'Inscription a bien été prise en compte ! <br />
                            <span className="font-xss">Vous recevrez très prochainement par mail le suivi de votre entrée en formation !</span>
                        </h2>
                      )
                    )
                  }
                  
                </div>
              </div>
            </div>
          </div>
        </div>
        </AdminLayout>
    );
};

export default InscriptionCourse;
