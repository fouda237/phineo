import icon from '../../assets/images/wab_formation.jpg'
import {getUserStats} from "../../services/user.service";

import { ApexOptions } from "apexcharts";
import TableStatsCourse from 'components/Table/TableStatsCourse';
import { useAuthContext } from 'context';
import {AdminLayout} from 'layouts';
import React from 'react';
import { Bounce, Spinner } from 'react-activity';
import ReactApexChart from "react-apexcharts";
import Moment from 'react-moment';
import { useParams } from "react-router-dom";
import { createLog } from "services/user.service";

const columns =[
    {
        Header: "Nom de Formation",
        accessor: 'title',
    },
    {
        Header: "Progression",
        accessor: 'progression',
    },
    {
        Header: "Modules Validés",
        accessor: 'totalModulesValided',
    },
    {
        Header: "Vidéos Validées",
        accessor: 'videoValided',
    },
    {
        Header: "Quiz Validés",
        accessor: 'quizzValided',
    },
]

const options: ApexOptions = {
    chart: {
      type: 'radialBar',
      height: 240
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '20px',
            offsetY: -5,
          },
          value: {
            fontSize: '16px',
            show: true,
            offsetY: 5,
          },
          total: {
            show: false,
            label: 'Progession',
          }
        }
      }
    },
    labels: ['Vidéos', 'Quiz', 'Articles', 'Docs', 'Exercices'],
};

const optionsPercent: ApexOptions = {
    chart: {
      height: 100,
      type: 'radialBar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
         hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
        },

        track: {
          background: '#fff',
          strokeWidth: '67%',
          margin: 0,
        },
    
        dataLabels: {
          show: true,
          name: {
            show: false,
          },
          value: {
            offsetY: 5,
            color: '#111',
            fontSize: '12px',
            show: true,
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#2726f9'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'round'
    },
};

const UserStats = () => {
    const authContext = useAuthContext();
    const params = useParams();
    const [statsUser, setStatsUser] = React.useState<any>();
    const [allDatasProcessed, setAllDatasProcessed] = React.useState<any>();
    const [loadingStats, setLoadingStats] = React.useState(true);
    const [loadingRefresh, setLoadingRefresh] = React.useState(false);
    const [processUserStatsDone, setProcessUserStatsDone] = React.useState(false);

    React.useEffect(() => {
        if (!params) return;

        if (localStorage.getItem('statsUser') === null || (Date.now() - Number(localStorage.getItem('statsTime')) > 86400000)){
            getUserStats(authContext.authState.user.id).then(response => {
                if (response?.status == 200) {
                    setStatsUser(response?.data)
                    localStorage.setItem('statsUser', JSON.stringify(response?.data));
                    localStorage.setItem('statsTime', Date.now().toString());
                    setLoadingStats(false)
                }
            })
        } else {
            setStatsUser(JSON.parse(localStorage.getItem('statsUser')!))
            setLoadingStats(false)
        }     
        
        createLog(params, 'studentStats')        
    }, [])

    const refreshStats = () => {
        setLoadingRefresh(true)
        getUserStats(authContext.authState.user.id).then(response => {
            if (response?.status == 200) {
                setStatsUser(response?.data)
                localStorage.setItem('statsUser', JSON.stringify(response?.data));
                localStorage.setItem('statsTime', Date.now().toString());
                setLoadingStats(false)
                setLoadingRefresh(false)
            }
        })
    }
      

    if (loadingStats && !statsUser) return (
        <AdminLayout>
            <div className='row mb-4'>
                <div className="col-lg-12">
                    <div className="card w-100 bg-skype pl-5 pr-5 pt-4 pb-4 border-0 rounded-lg d-block float-left">
                      <img
                        src={icon}
                        alt="Wab"
                        className="w75 position-relative top--10 float-left mr-4 mt--1 rounded-circle mt-2"
                      />
                      <h2 className="d-inline-block float-left mb-0 text-white fw-600 font-md lh-3 mt-2">
                        Hello {authContext.authState.user.firstName}, <br />
                        Bienvenue dans ton Parcours Étudiant !
                      </h2>
                    </div>
                </div>
            </div>

            <div className='mt-4 ml-2 mb-4' style={{ display: 'flex', alignItems: 'center'}}>
                <Bounce /> <p className='mb-0 ml-3 fw-700'>Chargement de votre Parcours en cours ... </p>
            </div>
        </AdminLayout>
    )

    function timeConvert(n: any) {
        const num = n;
        const hours = (num / 60);
        const rhours = Math.floor(hours);
        const minutes = (hours - rhours) * 60;
        const rminutes = Math.round(minutes);
        if (rhours === 0){
            return rminutes + " min";
        } else {
            return rhours + "h " + rminutes + "min";
        }
    }

    if (!loadingStats && statsUser && !processUserStatsDone) {
        processUserStats()
        setProcessUserStatsDone(true)        
    }

    function processUserStats() {
        const allDatas: { videoValided: number; quizzValided: number; articleValided: number; docValided: number; exerciseSend: number; videoModuleNb: number; quizzModuleNb: number; articleModuleNb: number; docModuleNb: number; exerciseModuleNb: number; totalModules: number; totalModulesValided: number; }[] = []
        
        statsUser.userStats.courses.map((course: any, key: number) => {
            let videoValided = 0;
            let quizzValided = 0;
            let articleValided = 0;
            let docValided = 0;
            let exerciseSend = 0;
            let videoModuleNb = 0; 
            let quizzModuleNb = 0;
            let articleModuleNb = 0;
            let docModuleNb = 0;
            let exerciseModuleNb = 0;
            let totalModules = 0;
            let totalModulesValided = 0;

            for (let sectionNb = 0; sectionNb < course.sections.length; sectionNb++) {
                for (let moduleNb = 0; moduleNb < course.sections[sectionNb].modules.length; moduleNb++){
                    if (course.sections[sectionNb].modules[moduleNb].type === 'video'){
                        videoModuleNb = videoModuleNb +1
                        
                        if (course.responses[0].modulesResponse.length > 0){
                            for ( let x = 0; x < course.responses[0].modulesResponse.length; x++){
                                if (course.responses[0].modulesResponse[x].moduleId == course.sections[sectionNb].modules[moduleNb].id){
                                    if (course.responses[0].modulesResponse[x].validated == true) {
                                        videoValided = videoValided +1
                                        totalModulesValided = totalModulesValided +1
                                    }
                                }
                            }
                        } 
                    }
                    
                    if (course.sections[sectionNb].modules[moduleNb].type === 'quizz'){
                        quizzModuleNb = quizzModuleNb +1
                        
                        if (course.responses[0].modulesResponse.length > 0){
                            for ( let x = 0; x < course.responses[0].modulesResponse.length; x++){
                                if (course.responses[0].modulesResponse[x].moduleId == course.sections[sectionNb].modules[moduleNb].id){
                                    if (course.responses[0].modulesResponse[x].validated == true) {
                                        quizzValided = quizzValided +1
                                        totalModulesValided = totalModulesValided +1
                                    }
                                }
                            }
                        } 
                    }
                    
                    if (course.sections[sectionNb].modules[moduleNb].type === 'text'){
                        articleModuleNb = articleModuleNb +1
                        
                        if (course.responses[0].modulesResponse.length > 0){
                            for ( let x = 0; x < course.responses[0].modulesResponse.length; x++){
                                if (course.responses[0].modulesResponse[x].moduleId == course.sections[sectionNb].modules[moduleNb].id){
                                    if (course.responses[0].modulesResponse[x].validated == true) {
                                        articleValided = articleValided +1
                                        totalModulesValided = totalModulesValided +1
                                    }
                                }
                            }
                        } 
                    }
                    
                    if (course.sections[sectionNb].modules[moduleNb].type === 'correction' || course.sections[sectionNb].modules[moduleNb].type === 'correction-url'){
                        exerciseModuleNb = exerciseModuleNb +1
                        
                        if (course.responses[0].modulesResponse.length > 0){
                            for ( let x = 0; x < course.responses[0].modulesResponse.length; x++){
                                if (course.responses[0].modulesResponse[x].moduleId == course.sections[sectionNb].modules[moduleNb].id){
                                    if (course.responses[0].modulesResponse[x].validated == true) {
                                        exerciseSend = exerciseSend +1
                                        totalModulesValided = totalModulesValided +1
                                    }
                                }
                            }
                        } 
                    }
                    
                    if (course.sections[sectionNb].modules[moduleNb].type === 'pdf' || course.sections[sectionNb].modules[moduleNb].type === 'fichier'){
                        docModuleNb = docModuleNb +1
                        
                        if (course.responses[0].modulesResponse.length > 0){
                            for ( let x = 0; x < course.responses[0].modulesResponse.length; x++){
                                if (course.responses[0].modulesResponse[x].moduleId == course.sections[sectionNb].modules[moduleNb].id){
                                    if (course.responses[0].modulesResponse[x].validated == true) {
                                        docValided = docValided +1
                                        totalModulesValided = totalModulesValided +1
                                    }
                                }
                            }
                        } 
                    }

                    totalModules = totalModules +1
                }
            }

            const oneData = {
                image: course.image, 
                title: course.title, 
                progression: ((totalModulesValided/totalModules) * 100).toFixed(0),
                videoValided,
                quizzValided,
                articleValided,
                docValided,
                exerciseSend,
                videoModuleNb, 
                quizzModuleNb,
                articleModuleNb,
                docModuleNb,
                exerciseModuleNb,
                totalModules,
                totalModulesValided,
            }

            allDatas.push(oneData)
        })

        setAllDatasProcessed(allDatas)
    }

    return (
        <AdminLayout>
            <div className='row'>
                <div className="col-lg-12">
                    <div className="card w-100 bg-skype pl-5 pr-5 pt-4 pb-4 border-0 rounded-lg d-block float-left">
                      <img
                        src={icon}
                        alt="Wab"
                        className="w75 position-relative top--10 float-left mr-4 mt--1 rounded-circle mt-2"
                      />
                      <h2 className="d-inline-block float-left mb-0 text-white fw-600 font-md lh-3 mt-2">
                        Hello {authContext.authState.user.firstName}, <br />
                        Bienvenue dans ton Parcours Étudiant !
                      </h2>
                    </div>
                </div>
            </div>

            {localStorage.getItem('statsTime') !== null && (
                <div className='row mt-2 mb-2'>
                    <div className='col-md-12'>
                        <div className='float-right'>
                            {loadingRefresh ? (
                                <p className='font-xsss text-grey-500' style={{ display: 'flex', alignItems: 'center'}}>
                                    <Spinner className='mr-2' /> Actualisation en cours
                                </p>
                            ) : (
                                <p className='font-xsss text-grey-500 mb-0'>
                                    Actualisé il y a {timeConvert((Date.now() - Number(localStorage.getItem('statsTime')!)) / 60000)}utes |
                                    <button
                                        className='border-0 bg-transparent ml-2 text-grey-500'
                                        onClick={() => refreshStats()}
                                    >
                                        Rafraichir <i className='feather feather-refresh-cw ml-1'></i>
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}


            <div className='row mb-4'>
                <div className="col-md-4">
                    <div className="card w-100 p-1 border-0 rounded-lg bg-white shadow-md overflow-hidden">
                      <div className="card-body p-4 text-center">
                        <h2 className="text-grey-900 fw-700  font-xl mt-2 mb-2 ls-3 lh-1">
                        {statsUser.userStats.courses.length}
                        </h2>
                        <h4 className="fw-700 text-grey-500 font-xsssss ls-3 text-uppercase mb-0 mt-0">
                            <i className='feather feather-play-circle mr-2'></i>
                            FORMATIONS suivies
                        </h4>
                      </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card w-100 p-1 border-0 rounded-lg bg-white shadow-md overflow-hidden">
                      <div className="card-body p-4 text-center">
                        <h2 className="text-grey-900 fw-700  font-xl mt-2 mb-2 ls-3 lh-1">
                            {timeConvert(statsUser.totalTimeOnPlatform)}
                        </h2>
                        <h4 className="fw-700 text-grey-500 font-xsssss ls-3 text-uppercase mb-0 mt-0">
                            <i className='feather feather-eye mr-2'></i>
                            TEMPS PASSÉ AVEC Wab
                        </h4>
                      </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card w-100 p-1 border-0 rounded-lg bg-white shadow-md overflow-hidden">
                      <div className="card-body p-4 text-center">
                        <h2 className="text-grey-900 fw-700 font-xl mt-2 mb-2 ls-3 lh-1">
                            <Moment format="MMMM 'YY" style={{ textTransform: "capitalize"}}>{statsUser.inscriptionDate}</Moment>
                        </h2>
                        <h4 className="fw-700 text-grey-500 font-xsssss ls-3 text-uppercase mb-0 mt-0">
                            <i className='feather feather-zap mr-2'></i>
                            ARRIVÉE SUR WAB
                        </h4>
                      </div>
                    </div>
                </div>
            </div>

            {allDatasProcessed && (
                <TableStatsCourse columns={columns} data={allDatasProcessed.length > 0 ? allDatasProcessed : []} timeConvert={timeConvert} statsUser={statsUser}/>
            )}

        </AdminLayout>
    );
};

export default UserStats;
