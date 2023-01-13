import logo from '../../../../assets/images/wab_formation.jpg'
import {getUser,getUserLogsCourse} from "../../../../services/user.service";
import { IUser } from "../../../../types/user.types";

import Table from "components/Table/Table";
import {useCourseContext} from 'context';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { AdminLayout } from 'layouts';
import moment from 'moment';
import React from 'react';
import { Spinner } from "react-activity";
import { useParams} from "react-router-dom";

const logsColumns =[
    {
        Header: "N°",
        accessor: 'connexionNb',
    },
    {
        Header: "Date de Début",
        accessor: 'startDate',
        type: "date-time"
    },
    {
        Header: "Date de Fin",
        accessor: 'endDate',
        type: "date-time"
    },
    {
        Header: "Durée de la Session",
        accessor: 'connexionTime',
        type: "time"
    },
    {
        Header: "Temps Cumulé",
        accessor: 'timeCumulated',
        type: "time"
    }
]


const CourseUserLogs = () => {
    const params = useParams();
    const courseContext = useCourseContext();
    const [logsCourse, setLogsCourse] = React.useState<any>();
    const [loadingExport, setLoadingExport] = React.useState(false);
    const [user, setUser] = React.useState<IUser>({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        role: ""
    });


    React.useEffect(() => {
        if (!params) return;
        if (!params.id) return;
        if (!params.userId) return;

        courseContext.getCurrentCourse(params.id);

        getUser({ id: params.userId }).then(response => {
            if (response) {
                setUser(response.data);
            }
        });

        getUserLogsCourse(params.id, params.userId).then(response => {
            if (response) {
                setLogsCourse(response.data)
            }
        })
    }, [])

    if (!logsCourse || !courseContext.currentCourse || !user) return (
        <AdminLayout>
            <Spinner />
        </AdminLayout>
    )

    function timeConvert(n: any) {
        const num = n;
        const hours = (num / 60);
        const rhours = Math.floor(hours);
        const minutes = (hours - rhours) * 60;
        const rminutes = Math.round(minutes);
        return rhours + "h " + rminutes + "min";
    }

    const exportPDF = (async () => {
        setLoadingExport(true)

        const unit = "pt";
        const size = "A4"; 
        const orientation = "portrait"; 
    
        const doc = new jsPDF(orientation, unit, size);
    
        doc.addImage(logo, "PNG", 180, 30, 230, 46);

        doc.setFontSize(16);
        doc.text("Relevé de Connexion :", 40, 120);

        doc.setFontSize(12);
        doc.text(`${user.lastName} ${user.firstName}`, 40, 140);
        doc.text(`${courseContext.currentCourse.title}`, 40, 156);

        doc.setFontSize(12);
        doc.text("Wab SAS", 410, 120);
        doc.text("55t Avenue René Cassin", 410, 136);
        doc.text("69009 Lyon, France", 410, 152);

        const headers = [["Connexion n°", "Date de Début", "Date de Fin", "Durée de la Session", "Temps Cumulé"]];

        const data = logsCourse.map((log: { connexionNb: any; startDate: any; endDate: any; connexionTime: any; timeCumulated: any; }) => [
            log.connexionNb, 
            moment(log.startDate).format("DD MMMM YYYY - HH:mm"), 
            moment(log.endDate).format("DD MMMM YYYY - HH:mm"), 
            timeConvert(log.connexionTime), 
            timeConvert(log.timeCumulated)
        ]);
    
        autoTable(doc, {
            styles: { halign: 'center' },
            headStyles: {fillColor: [39, 38, 249]},
            startY: 190,
            head: headers,
            body: data            
        });

        doc.addImage(logo, "PNG", 350, (doc as any).lastAutoTable.finalY + 40, 161, 93);
        doc.text('Votre Signature :', 100, (doc as any).lastAutoTable.finalY + 50)

        doc.save(`${user.lastName}_${user.firstName}_report.pdf`)

        setLoadingExport(false)
    })

  
  return (
        <AdminLayout>

            {user && courseContext.currentCourse.title && (
                <div className="container px-3 py-4">
                    <div className="row">
                        <div className="col-lg-12 d-flex mb-2 d-flex-middle">
                            <div>
                                <h2 className="text-grey-900 font-md fw-700">{user.firstName} {user.lastName} - {courseContext.currentCourse.title}</h2>
                                <h3 className="text-grey-900 font-xs fw-600"> <i className="feather-file-text font-xss mr-3"></i>Relevé de Connexion</h3>
                            </div>
                            <a
                                href={`/admin/course/${params.id}?t=Eleves`}
                                className="ml-auto p-0 btn p-2 lh-24 w150 ls-3 d-inline-block rounded-xl bg-current font-xsssss fw-600 ls-lg text-white"
                            >
                                <i className="feather-chevron-left mr-0"></i> RETOUR
                            </a>
                        </div>
                    </div>
                </div>
            )}



            <div className="row">
                <div className="col-lg-12">
                    <div className="card border-0 pt-3 px-4 mt-0 rounded-lg admin-form">
                        <div className="card-body d-block">
                            { loadingExport ? (
                                <button
                                    className="mb-5 btn p-3 pr-4 pl-4 lh-24 ls-3 d-inline-block rounded-xl bg-skype fw-600 font-xsss ls-lg text-white mt-2"
                                >
                                    <Spinner />
                                </button>
                            ) : (
                                <button
                                    onClick={() => exportPDF()}
                                    className="mb-5 btn p-3 pr-4 pl-4 lh-24 ls-3 d-inline-block rounded-xl bg-skype fw-600 font-xsss ls-lg text-white mt-2"
                                >
                                    <i className="feather feather-download mr-3"></i>
                                    Télécharger le Relevé de Connexion
                                </button>
                            )}
                            <h2 className="text-grey-900 font-sm fw-700">Détails des Connexions</h2>
                            {logsCourse && (
                                <Table columns={logsColumns} data={logsCourse.length > 0 ? logsCourse : []} noActions/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};


export default CourseUserLogs;