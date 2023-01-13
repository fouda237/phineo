//@ts-nocheck
import React, {useCallback, useRef, useState} from 'react';
import { getAnswerListStyle,getItemStyle, Reorder } from "../DraggableComponent/utils";
import ReactFlow, {
    addEdge,
    ControlButton,
    Controls,
    Handle,
    Position,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
} from 'react-flow-renderer';
import { Modal } from 'react-bootstrap';
import { DragDropContext, Draggable,Droppable } from "react-beautiful-dnd";
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";
import { createTag, getTagsCourse } from "../../services/course.service";

import ReactTooltip from "react-tooltip";
import Sidebar from './FlowSideBar';
import './Flow.scss';
import { Spinner } from 'react-activity';

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = ({updateNodes, currentEdges, currentNodes, setTagsCourse, tagsCourse, getAllCourseTags}) => {
    const params = useParams();
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(currentNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(currentEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [nodeIdSelected, setNodeIdSelected] = React.useState<any>()
    const [nodeDataLabelSelected, setNodeDataLabelSelected] = React.useState<any>()
    const [nodeDataLabelTemp, setNodeDataLabelTemp] = React.useState<any>()
    const [nodeDataCustomTemp, setNodeDataCustomTemp] = React.useState<any>()
    const [nodeTypeSelected, setNodeTypeSelected] = React.useState<any>()
    const [settingsModal, setSettingsModal] = React.useState(false)
    const [refreshVariant, setRefreshVariant] = React.useState(false)
    const [createTagMode, setCreateTagMode] = React.useState(false)
    const [loadingCreatingTag, setLoadingCreatingTag] = React.useState(false)
    const [errorTagCreation, setErrorTagCreation] = React.useState(false)
    const [successTagCreation, setSuccessTagCreation] = React.useState(false)
    const [messagePersonnalizedLabelEdit, setMessagePersonnalizedLabelEdit] = React.useState(false)
    const [messagePersonnalizedNewVariantCreation, setMessagePersonnalizedNewVariantCreation] = React.useState(false)
    const [messagePersonnalizedNewVariantUpdate, setMessagePersonnalizedNewVariantUpdate] = React.useState(false)
    const [indexCustomMessageToUpdate, setIndexCustomMessageToUpdate] = React.useState<any>()


    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<Inputs>();

    const createTagOnSubmit = handleSubmit(async (data) => {
        setLoadingCreatingTag(true)
        if (!params.courseId) return
        if (!params.interactionId) return

        if (data.tag) {
            const createTagReq = await createTag(params.courseId, data.tag)

            if (createTagReq && createTagReq.status === 200) {
                setNodeDataLabelSelected(createTagReq.data.id)
                getAllCourseTags(params.courseId)
                setErrorTagCreation(false)
                setSuccessTagCreation(true)
                setLoadingCreatingTag(false)
                reset({ tag: '' })
                setCreateTagMode(false)
            }

            if (createTagReq && createTagReq.status > 400) {
                setErrorTagCreation(true)
                setSuccessTagCreation(false)
                setLoadingCreatingTag(false)
                setCreateTagMode(true)
            }
        }
    });

    React.useEffect(() => {

        updateNodes(nodes, edges)
            id = nodes.length
    }, [nodes.length, edges]);


    const updateLabel = (id, label) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    // it's important that you create a new object here
                    // in order to notify react flow about the change
                    node.data = {
                        ...node.data,
                        label: label,
                    };
                }

                return node;
            })
        );
    }
    const updateLabelWithCustom = (id, label, custom) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    // it's important that you create a new object here
                    // in order to notify react flow about the change
                    node.data = {
                        ...node.data,
                        label: label,
                        custom: custom,
                    };
                }

                return node;
            })
        );
    }

    const updateLabelSelected = (label) => {
        setNodeDataLabelSelected(label)
    }

    const saveModalAction = (nodeId: any, nodeDataLabel: any, tagId: any) => {
        updateLabel(nodeId, nodeDataLabel)
        setNodeIdSelected('0')
        setNodeTypeSelected('0')
        setNodeDataLabelSelected('0')
        setSettingsModal(!settingsModal);
    }

    const onDeleteNode = (nodeToDelete) => {
        if (nodeToDelete.length > 0 ) {
            const nds = nodes.filter((node) => node.id != nodeToDelete[0].id);
            setNodes(nds);
        }
    }

    function handleSettingsModal(nodeId: any, nodeDataLabel: any, nodeType: any) {
        setNodeIdSelected(nodeId)
        setNodeTypeSelected(nodeType)
        setNodeDataLabelSelected(nodeDataLabel)
        setSettingsModal(!settingsModal);
    }

    const addVariantMessage = handleSubmit(async (data) => {
        nodeDataLabelSelected.custom.push(data)
        setNodeDataLabelSelected(nodeDataLabelSelected)
        reset({ tagId: '', label: '' })
        setMessagePersonnalizedNewVariantCreation(false)
    });

    const BeginTypeNode = (node) => {
        return (
            <div className="border border-primary p-2 pt-3 pb-3 text-center shadow-2xl rounded-lg w400 bg-white">
                <h2
                    className='font-xs'
                >
                    1er Message
                </h2>
                <p
                    className='text-grey-700 mb-3 font-xss lh-3'
                >
                    {node.data.label.length > 80 ? (
                        node.data.label.slice(0, 80) + '...'
                    ) : (
                        node.data.label
                    )}
                </p>
                <a
                    className='btn p-1 pr-3 pl-3 rounded-xl bg-white border-1 border-primary text-primary'
                    onClick={() => handleSettingsModal(node.id, node.data.label, 'beginType')}
                >
                    <i className='feather feather-settings mr-2'></i>
                    Modifier le 1er Message
                </a>
                <Handle type="source" position={Position.Bottom} id="a"/>
            </div>
        )
    }

    const QuestionTypeNode = (node) => {
        return (
            <div className="border border-warning p-2 pt-3 pb-3 text-center shadow-2xl rounded-lg w400 bg-white">
                <Handle type="target" position={Position.Top}/>                
                <h2
                    className='font-xs'
                >
                    Question
                </h2>
                <p
                    className='text-grey-700 mb-3 font-xss lh-3'
                >
                    {node.data.label.length > 80 ? (
                        node.data.label.slice(0, 80) + '...'
                    ) : (
                        node.data.label
                    )}
                </p>
                <a
                    className='btn p-1 pr-3 pl-3 rounded-xl bg-white border-1 border-warning text-warning'
                    onClick={() => handleSettingsModal(node.id, node.data.label, 'questionType')}
                >
                    <i className='feather feather-settings mr-2'></i>
                    Modifier la Question
                </a>
                <Handle type="source" position={Position.Bottom} id="a"/>
            </div>
        )
    }


    const AnswerTypeNode = (node) => {
        return (
            <div className="border border-success p-2 pt-3 pb-3 text-center shadow-2xl rounded-lg w400 bg-white">
                <Handle type="target" position={Position.Top}/>                
                <h2
                    className='font-xs'
                >
                    Choix Réponse Élève
                </h2>
                <p
                    className='text-grey-700 mb-3 font-xss lh-3'
                >
                    {node.data.label.length > 80 ? (
                        node.data.label.slice(0, 80) + '...'
                    ) : (
                        node.data.label
                    )}
                </p>
                <a
                    className='btn p-1 pr-3 pl-3 rounded-xl bg-white border-1 border-success text-success'
                    onClick={() => handleSettingsModal(node.id, node.data.label, 'answerType')}
                >
                    <i className='feather feather-settings mr-2'></i>
                    Modifier la Réponse
                </a>
                <Handle type="source" position={Position.Bottom} id="a"/>
            </div>
        )
    }

    const TeacherMessageNode = (node) => {
        return (            
            <div className="border border-info p-2 pt-3 pb-3 text-center shadow-2xl rounded-lg w400 bg-white">
                <Handle type="target" position={Position.Top}/>
                <p
                    className='text-grey-700 mb-3 font-xss lh-3'
                >
                    {node.data.label.length > 80 ? (
                        node.data.label.slice(0, 80) + '...'
                    ) : (
                        node.data.label
                    )}
                </p>
                <a
                    className='btn p-1 pr-3 pl-3 rounded-xl bg-white border-1 border-primary text-primary'
                    onClick={() => handleSettingsModal(node.id, node.data.label, 'teacherMessage')}
                >
                    <i className='feather feather-settings mr-2'></i>
                    Modifier le Message
                </a>
                <Handle type="source" position={Position.Bottom} id="a"/>
            </div>
        )
    }

    const EndTypeNode = (node) => {
        return (
            <div className="border border-danger p-2 pt-3 pb-3 text-center shadow-2xl rounded-lg w400 bg-white">
                <Handle type="target" position={Position.Top}/>
                <p
                    className='text-grey-700 mb-3 font-xss lh-3'
                >
                    {node.data.label.length > 80 ? (
                        node.data.label.slice(0, 80) + '...'
                    ) : (
                        node.data.label
                    )}
                </p>
                <a
                    className='btn p-1 pr-3 pl-3 rounded-xl bg-white border-1 border-danger text-danger'
                    onClick={() => handleSettingsModal(node.id, node.data.label, 'endType')}
                >
                    <i className='feather feather-settings mr-2'></i>
                    Modifier le Message de Fin
                </a>
            </div>
        )
    }

    const AddTagToUserNode = (node) => {
        return (
            <div className="border border-primary p-2 pt-3 pb-3 text-center shadow-2xl rounded-lg w400 bg-white">
                <Handle type="target" position={Position.Top}/>               
                <h2
                    className='font-xs'
                >
                    Ajout d'un Tag à l'Élève 
                </h2>
                <p
                    className='text-grey-700 mb-3 font-xss lh-3'
                >
                    {(tagsCourse && tagsCourse.length > 0) && tagsCourse.map((tag, i) => (
                        node.data.label === tag.id && tag.tagName
                    ))}
                    {node.data.label === 'AddTagToUser' && (<p className='text-danger'><i className='feather feather-alert-triangle mr-2'></i> Aucun Tag Sélectionné !</p>)}
                </p>
                <a
                    className='btn p-1 pr-3 pl-3 rounded-xl bg-white border-1 border-primary text-primary'
                    onClick={() => handleSettingsModal(node.id, node.data.label, 'AddTagToUser')}
                >
                    <i className='feather feather-settings mr-2'></i>
                    Modifier le Tag à Ajouter
                </a>
                <Handle type="source" position={Position.Bottom} id="a"/>
            </div>
        )
    }

    const RemoveTagToUserNode = (node) => {
        return (
            <div className="border border-danger p-2 pt-3 pb-3 text-center shadow-2xl rounded-lg w400 bg-white">
                <Handle type="target" position={Position.Top}/>               
                <h2
                    className='font-xs'
                >
                    Enlever Tag à l'Élève 
                </h2>
                <p
                    className='text-grey-700 mb-3 font-xss lh-3'
                >
                    {(tagsCourse && tagsCourse.length > 0) && tagsCourse.map((tag, i) => (
                        node.data.label === tag.id && tag.tagName
                    ))}
                    {node.data.label === 'RemoveTagToUser' && (<p className='text-danger'><i className='feather feather-alert-triangle mr-2'></i> Aucun Tag Sélectionné !</p>)}
                </p>
                <a
                    className='btn p-1 pr-3 pl-3 rounded-xl bg-white border-1 border-danger text-danger'
                    onClick={() => handleSettingsModal(node.id, node.data.label, 'RemoveTagToUser')}
                >
                    <i className='feather feather-settings mr-2'></i>
                    Modifier le Tag à Enlever
                </a>
                <Handle type="source" position={Position.Bottom} id="a"/>
            </div>
        )
    }

    const TagsConditionBeginNode = (node) => {
        return (
                <div className="border border-warning p-2 pt-4 pb-3 text-center shadow-2xl rounded-lg w400 bg-white">
                    <Handle type="target" position={Position.Top}/>               
                    <h2
                        className='font-xs'
                    >
                        Tags
                    </h2>

                    <div style={{ position: 'absolute', right: '20px', top: '7px'}} data-tip data-for={node.id}>
                        <i className='feather feather-help-circle ml-2'></i>
                    </div>

                    <ReactTooltip id={node.id} effect='solid'>
                        <p
                            className='text-white mb-3 mt-2 font-xss lh-3 w400'
                        >
                            Glissez en dessous de ce bloc les "Conditions Si Tag" pour personnaliser 
                            le parcours de votre élève selon les Tags qui lui ont été affecté !
                        </p>
                    </ReactTooltip>
                    <Handle type="source" position={Position.Bottom} id="a"/>
                </div>
        )
    }

    const TagConditionNode = (node) => {
        return (
            <div className="border border-success p-2 pt-3 pb-3 text-center shadow-2xl rounded-lg w400 bg-white">
                <Handle type="target" position={Position.Top}/>               
                <h2
                    className='font-xs'
                >
                    Condition Si Tag
                </h2>

                <div style={{ position: 'absolute', right: '20px', top: '7px'}} data-tip data-for={node.id}>
                    <i className='feather feather-help-circle ml-2'></i>
                </div>

                <p
                    className='text-grey-700 mb-3 font-xss lh-3'
                >
                    {(tagsCourse && tagsCourse.length > 0) && tagsCourse.map((tag, i) => (
                        node.data.label === tag.id && tag.tagName
                    ))}
                    {node.data.label === 'TagCondition' && 'Aucun Tag'}
                </p>

                <ReactTooltip id={node.id} effect='solid'>
                    <p
                        className='text-white mb-3 mt-2 font-xss lh-3 w400'
                    >
                        Si l'élève possède le tag défini ici, alors son interraction suivra son cours par là
                    </p>
                </ReactTooltip>
                
                <a
                    className='btn p-1 pr-3 pl-3 rounded-xl bg-white border-1 border-success text-success'
                    onClick={() => handleSettingsModal(node.id, node.data.label, 'TagCondition')}
                >
                    <i className='feather feather-settings mr-2'></i>
                    Modifier le Tag de Condition
                </a>
                <Handle type="source" position={Position.Bottom} id="a"/>
            </div>
        )
    }

    const MessagePersonnalizedTagNode = (node) => {
        return (
            <div className="border border-primary p-2 pt-3 pb-3 text-center shadow-2xl rounded-lg w400 bg-white">
                <Handle type="target" position={Position.Top}/>               
                <h2
                    className='font-xs'
                >
                    Message Personnalisé
                </h2>

                <div style={{ position: 'absolute', right: '20px', top: '7px'}} data-tip data-for={node.id}>
                    <i className='feather feather-help-circle ml-2'></i>
                </div>

                <p>
                    {node.data.label}
                </p>

                <ReactTooltip id={node.id} effect='solid'>
                    <p
                        className='text-white mb-3 mt-2 font-xss lh-3 w400'
                    >
                        Ajouter différentes variantes de ce message à afficher selon le tag associé à votre élève au moment 
                        où l'interaction passera par là !
                    </p>
                </ReactTooltip>
                
                <a
                    className='btn p-1 pr-3 pl-3 rounded-xl bg-white border-1 border-primary text-primary'
                    onClick={() => handleSettingsModal(node.id, node.data, 'MessagePersonnalizedTag')}
                >
                    <i className='feather feather-settings mr-2'></i>
                    Modifier le Message Personnalisé
                </a>
                <Handle type="source" position={Position.Bottom} id="a"/>
            </div>
        )
    }


    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            if (type === "QuestionType") {
                const newNode = {
                    id: getId(),
                    type,
                    position,
                    data: {label: `Question`, answered: false, target: ""},
                };
                setNodes((nds) => nds.concat(newNode));
            }
            else if (type === "BeginType") {
                const newNode = {
                    id: getId(),
                    type,
                    position,
                    data: {label: `1er Message`},
                };
                setNodes((nds) => nds.concat(newNode));
            }
            else if (type === "AnswerType") {
                const newNode = {
                    id: getId(),
                    type,
                    position,
                    data: {label: `Réponse Élève`},
                };
                setNodes((nds) => nds.concat(newNode));
            }
            else if (type === "TeacherMessage") {
                const newNode = {
                    id: getId(),
                    type,
                    position,
                    data: {label: `Message`},
                };
                setNodes((nds) => nds.concat(newNode));
            }
            else if (type === "EndType") {
                const newNode = {
                    id: getId(),
                    type,
                    position,
                    data: {label: `Message Final`},
                };
                setNodes((nds) => nds.concat(newNode));
            }
            else if (type === "MessagePersonnalizedTag") {
                const newNode = {
                    id: getId(),
                    type,
                    position,
                    data: {
                        label: `Message Par Défaut`, 
                        custom: [],
                    },
                };
                setNodes((nds) => nds.concat(newNode));
            } else {
                const newNode = {
                    id: getId(),
                    type,
                    position,
                    data: {label: `${type}`},
                };
                setNodes((nds) => nds.concat(newNode));
            }
        },
        [reactFlowInstance]
    );

    
    const nodeTypes = React.useMemo(() => ({
        BeginType: BeginTypeNode,
        QuestionType: QuestionTypeNode,
        AnswerType: AnswerTypeNode,
        TeacherMessage: TeacherMessageNode,
        AddTagToUser: AddTagToUserNode,
        RemoveTagToUser: RemoveTagToUserNode,
        TagsConditionBegin: TagsConditionBeginNode,
        TagCondition: TagConditionNode,
        MessagePersonnalizedTag: MessagePersonnalizedTagNode,
        EndType: EndTypeNode
    }), []);


    function onDragEnd(result: any) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        if (result.type === "tags") {
            const messageVariantsUpdate = Reorder(
                nodeDataLabelSelected.custom,
                result.source.index,
                result.destination.index
            );

            setNodeDataLabelSelected({ label: nodeDataLabelSelected.label, custom: messageVariantsUpdate })
            updateLabelWithCustom(nodeIdSelected, nodeDataLabelSelected.label, messageVariantsUpdate)            
        }
    }

    return (
        <div className="dndflow">
            <ReactFlowProvider>
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        nodeTypes={nodeTypes}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onNodesDelete={onDeleteNode}
                        defaultZoom={0.8}
                        minZoom={0.15}
                    >
                        <Controls showInteractive={false}>
                        </Controls>
                    </ReactFlow>
                </div>
                <Sidebar/>
            </ReactFlowProvider>



            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={settingsModal}
            >
                <Modal.Body className="text-center p-5">
                    <h2 className='mb-4 fw-600'>
                        { createTagMode ? (
                            <>
                                <i className='feather feather-plus mr-3'></i>
                                Créer un Nouveau Tag
                            </>
                        ) : (
                            <>
                                <i className='feather feather-edit mr-3'></i>
                                Modifier l'Interaction
                            </>
                        )}
                    </h2>
                    
                    <div className="mt-3 mb-4">
                        {(
                            nodeTypeSelected === 'beginType' || 
                            nodeTypeSelected === 'teacherMessage' || 
                            nodeTypeSelected === 'questionType' || 
                            nodeTypeSelected === 'answerType' || 
                            nodeTypeSelected === 'endType'
                        ) && (
                            <textarea 
                                className="form-control form_control" id="text" name="text" onChange={(e) => setNodeDataLabelSelected(e.target.value)}
                                rows={5}
                                value={nodeDataLabelSelected}
                            />
                        )}

                        {(
                            nodeTypeSelected === 'AddTagToUser' ||
                            nodeTypeSelected === 'RemoveTagToUser' ||
                            nodeTypeSelected === 'TagCondition'
                        ) && (
                            createTagMode ? (
                                loadingCreatingTag ? (
                                    <>
                                        <div className='mt-5 mb-4' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            <Spinner /> <p className='mb-0 ml-3'>Création du Tag en cours ... </p>
                                        </div>
                                    </>
                                ) : (
                                    <form 
                                        className='admin-form'
                                        onSubmit={createTagOnSubmit}
                                    >
                                        <div className="form-group mb-1">
                                            {errorTagCreation && (
                                                <p
                                                    className='text-danger'
                                                >
                                                    Une erreur est survenue ... Merci de réessayer plus tard !
                                                </p>
                                            )}
                                            <label
                                                htmlFor="product_sku"
                                                className="form-label"
                                            >
                                                Nom du Tag :
                                            </label>
                                            <input
                                                {...register("tag", { required: true })}
                                                className="form-control form_control"
                                                type="text"
                                                placeholder="Nom du Tag *"
                                                required
                                            />
                                        </div>
    
                                        <button
                                            onClick={() => setCreateTagMode(false)}
                                            className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-danger font-xsss fw-600 ls-lg text-white border border-danger mt-2 pb-2 mr-3"
                                        >
                                            <i className="feather-x mr-2"></i> Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-current font-xsss fw-600 ls-lg text-white border border-current mt-2 pb-2"
                                        >
                                            <i className="feather-check mr-2"></i> Créer le Tag
                                        </button>
                                    </form>
                                )
                            ) : (
                                <div className='admin-form'>
                                    {
                                        tagsCourse && tagsCourse.length > 0 ? (
                                            <>
                                                <label
                                                    className="form-label"
                                                >

                                                    {nodeTypeSelected === 'TagCondition' ? (
                                                        'Sélectionner un Tag : '
                                                    ) : (
                                                        <>
                                                            Sélectionner un Tag à 
                                                                {nodeTypeSelected === 'AddTagToUser' && ' Ajouter '} 
                                                                {nodeTypeSelected === 'RemoveTagToUser' && ' Enlever '} 
                                                            à l'élève : 
                                                        </>
                                                    )} 
                                                </label>
                
                                                <select 
                                                    value={nodeDataLabelSelected}
                                                    onChange={(e) => setNodeDataLabelSelected(e.target.value)}
                                                    className="form-control form_control"
                                                >
                                                    <option key='default' value={nodeTypeSelected}>
                                                        Aucun Tag Sélectionné
                                                    </option>

                                                    {tagsCourse.map((option, i) => (
                                                        <option key={i} value={option.id}>
                                                            {option.tagName}
                                                        </option>
                                                    ))}
                                                </select>
                
                                                <hr className="solid mt-4 mb-4"></hr>
                                            </>
                                        ) : (
                                            <>
                                                <p>
                                                    Il n'y a aucun tag pour le moment ... Il est temps d'en créer un !
                                                </p>
                                            </>
                                        )
                                    }
                                    
                                    {successTagCreation && (
                                        <p
                                            className='text-success'
                                        >
                                            Le Tag a bien été créé !
                                        </p>
                                    )}


                                    
                                    <button
                                        onClick={() => {
                                            setErrorTagCreation(false)
                                            setSuccessTagCreation(false)
                                            setCreateTagMode(true)
                                        }}
                                        className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-white font-xsss fw-600 ls-lg text-current border border-primary mt-2 pb-2 mb-4"
                                    >
                                        <i className="feather-plus mr-2"></i> Créer un Nouveau Tag
                                    </button>
                                </div>
                            )
                        )}


                        { nodeTypeSelected === 'MessagePersonnalizedTag' && (
                            messagePersonnalizedNewVariantCreation ? (
                                messagePersonnalizedNewVariantUpdate ? (
                                    <div 
                                        className='admin-form'
                                        // onSubmit={addVariantMessage}
                                    >
                                        <h2
                                            className='font-xs fw-600'
                                            style={{ color: '#515184'}}
                                        >
                                            Modification d'une Variante du Message
                                        </h2>

                                        <label
                                            className="form-label w-100 text-left"
                                        > 
                                            Étape 1: Choisir le Tag de Condition
                                        </label>   
                    
                                        <select 
                                            value={nodeDataCustomTemp.tagId}
                                            onChange={(e) => setNodeDataCustomTemp({...nodeDataCustomTemp, tagId: e.target.value})}
                                            className="form-control form_control"
                                            required
                                        >

                                            {tagsCourse.map((option, i) => (
                                                <option key={i} value={option.id}>
                                                    {option.tagName}
                                                </option>
                                            ))}
                                        </select>

                                        <label
                                            className="form-label w-100 text-left"
                                        > 
                                            Étape 2: Entrer le Message à envoyer 
                                        </label>


                                        <textarea                             
                                            value={nodeDataCustomTemp.label}
                                            onChange={(e) => setNodeDataCustomTemp({...nodeDataCustomTemp, label: e.target.value})}
                                            className="form-control form_control" 
                                            placeholder='Entrer votre message personnalisé ici'
                                            required
                                            rows={5}
                                        />           
    
                                        <button 
                                            className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-danger font-xsss fw-600 ls-lg text-white border border-danger mt-2 pb-2 mr-3"
                                            onClick={() => {
                                                setMessagePersonnalizedNewVariantUpdate(false)
                                                setMessagePersonnalizedNewVariantCreation(false)
                                            }}
                                        >
                                            <i className='feather feather-x mr-1'></i> Annuler
                                        </button>
                                    
                                        <button
                                            onClick={() => {
                                                nodeDataLabelSelected.custom[indexCustomMessageToUpdate].tagId = nodeDataCustomTemp.tagId
                                                nodeDataLabelSelected.custom[indexCustomMessageToUpdate].label = nodeDataCustomTemp.label
                                                setMessagePersonnalizedNewVariantUpdate(false)
                                                setMessagePersonnalizedNewVariantCreation(false)
                                            }}
                                            className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-current font-xsss fw-600 ls-lg text-white border border-current mt-2 pb-2"
                                        >
                                            <i className="feather-check mr-2"></i> Modifier la Variante
                                        </button>
                                    </div>
                                ) : (
                                    <form 
                                        className='admin-form'
                                        onSubmit={addVariantMessage}
                                    >
                                        <h2
                                            className='font-xs fw-600'
                                            style={{ color: '#515184'}}
                                        >
                                            Création d'une Variante du Message
                                        </h2>
                                        <label
                                            className="form-label w-100 text-left"
                                        > 
                                            Étape 1: Choisir le Tag de Condition
                                        </label>
                    
                                        <select 
                                            {...register("tagId", { required: true })}
                                            className="form-control form_control"
                                            required
                                        >
    
                                            {tagsCourse.map((option, i) => (
                                                <option key={i} value={option.id}>
                                                    {option.tagName} - /* {option.id}
                                                </option>
                                            ))}
                                        </select>
    
                                        <label
                                            className="form-label w-100 text-left"
                                        > 
                                            Étape 2: Entrer le Message à envoyer 
                                        </label>
    
    
                                        <textarea                             
                                            {...register("label", { required: true })}
                                            className="form-control form_control" 
                                            placeholder='Entrer votre message personnalisé ici'
                                            required
                                            rows={5}
                                        />
    
                                        <button 
                                            className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-danger font-xsss fw-600 ls-lg text-white border border-danger mt-2 pb-2 mr-3"
                                            onClick={() => {
                                                reset({ tagId: '', label: '' })
                                                setMessagePersonnalizedNewVariantCreation(false)
                                            }}
                                        >
                                            <i className='feather feather-x mr-1'></i> Annuler
                                        </button>
                                    
                                        <button
                                            type="submit"
                                            className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-current font-xsss fw-600 ls-lg text-white border border-current mt-2 pb-2"
                                        >
                                            <i className="feather-check mr-2"></i> Créer la Variante
                                        </button>
                                    </form>
                                )
                            ) : (
                                <>
                                    <div className='w-100 admin-form'>
                                        <div className='messageCard'>
                                            <label
                                                className="form-label w-100 text-left"
                                            >
                                                Message Générique : 
                                                <i className='feather feather-help-circle ml-2' data-tip data-for='helpMessageGenerique'></i>

                                                <ReactTooltip id='helpMessageGenerique' effect='solid'>
                                                    <p className='w400 pt-2'>
                                                        Ce Message s'affichera si aucun tag associé aux variantes de messages n'est lié à l'élève. Ce message est requis.
                                                    </p>
                                                </ReactTooltip>
                                            </label>

                                            {messagePersonnalizedLabelEdit ? (
                                                <>
                                                    <textarea 
                                                        className="form-control form_control" id="text" name="text" onChange={(e) => setNodeDataLabelTemp(e.target.value)}
                                                        rows={5}
                                                        value={nodeDataLabelTemp}
                                                    />

                                                    <button
                                                        onClick={() => {
                                                                setNodeDataLabelTemp('0')
                                                                setMessagePersonnalizedLabelEdit(false)
                                                            }
                                                        }
                                                        className="border-0 btn rounded-6 lh-2 p-3 pl-4 pr-4 mt-0 mb-2 text-white bg-danger font-xssss text-uppercase fw-600 ls-3 mr-3"
                                                    >
                                                        <i className='feather feather-x mr-1'></i> Annuler
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                                setNodeDataLabelSelected({
                                                                    label: nodeDataLabelTemp, 
                                                                    custom: nodeDataLabelSelected.custom
                                                                })
                                                                updateLabelWithCustom(nodeIdSelected, nodeDataLabelTemp, nodeDataLabelSelected.custom)
                                                                setMessagePersonnalizedLabelEdit(false)
                                                            }
                                                        }
                                                        className="border-0 btn rounded-6 lh-2 p-3 pl-4 pr-4 mt-0 mb-2 text-white bg-current font-xssss text-uppercase fw-600 ls-3 ms-1 ml-2"
                                                    >
                                                        <i className='feather feather-check mr-1'></i> Enregistrer les Modifications
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <div className='p-3 d-flex border-grey-500 rounded-lg border'>
                                                        <p className='mb-0 font-xsss' style={{ marginTop: '2px'}}>
            
                                                            {nodeDataLabelSelected.label.length > 40 ? (
                                                                nodeDataLabelSelected.label.slice(0, 80) + '...'
                                                            ) : (
                                                                nodeDataLabelSelected.label
                                                            )}
                                                        </p>
            
                                                        <div className="ml-auto d-flex">
                                                            <button
                                                                onClick={() => {
                                                                        setNodeDataLabelTemp(nodeDataLabelSelected.label)
                                                                        setMessagePersonnalizedLabelEdit(true)
                                                                    }
                                                                } 
                                                                className="bg-white" style={{ border: "0px" }}
                                                            >
                                                                <i className="feather-edit me-1 font-xs text-grey-500 mr-2"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                
                                                    <hr className="solid mt-4 mb-4"></hr>

                                                    {
                                                        nodeDataLabelSelected.custom.length === 0 ? (
                                                            <>
                                                                <p>
                                                                    Il n'y a aucune variante pour le moment... Il est temps d'en créer une !
                                                                </p>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <h2
                                                                    className='font-xs fw-600 text-left mb-3'
                                                                    style={{ color: '#515184'}}
                                                                >
                                                                    Variantes du Message :
                                                                </h2>

                                                                { refreshVariant ? (
                                                                    <Spinner />
                                                                ) : (
                                                                    <DragDropContext onDragEnd={onDragEnd}>
                                                                        <Droppable droppableId="droppable" type="tags">
                                                                        {(provided, snapshot) => (
                                                                            <div
                                                                                {...provided.droppableProps}
                                                                                ref={provided.innerRef}
                                                                                style={getItemStyle(snapshot.isDraggingOver)}
                                                                            >
                                                                            {nodeDataLabelSelected.custom.map((variant:any, index:any) => (
                                                                                <Draggable 
                                                                                    key={variant.tagId} 
                                                                                    draggableId={variant.tagId} 
                                                                                    index={index}
                                                                                >
                                                                                {(provided, snapshot) => (
                                                                                    <div
                                                                                        ref={provided.innerRef}
                                                                                        {...provided.draggableProps}
                                                                                        {...provided.dragHandleProps}
                                                                                        style={getItemStyle(
                                                                                            snapshot.isDragging,
                                                                                            provided.draggableProps.style
                                                                                        )}
                                                                                    >
                                                                                        <label
                                                                                            className="form-label w-100 text-left mb-0"
                                                                                        >
                                                                                            Tag:
                                                                                            <span className='pl-2'>
                                                                                                {(tagsCourse && tagsCourse.length > 0) && tagsCourse.map((tag, i) => (
                                                                                                    variant.tagId === tag.id && tag.tagName
                                                                                                ))}    
                                                                                            </span> 
                                                                                            
                                            
                                                                                        </label>
                            
                                                                                        <div className='p-3 d-flex border-grey-500 rounded-lg border mb-3'>
                                                                                            <p className='mb-0 font-xsss' style={{ marginTop: '2px'}}>
    
                                                                                                {variant.label.length > 40 ? (
                                                                                                    variant.label.slice(0, 80) + '...'
                                                                                                ) : (
                                                                                                    variant.label
                                                                                                )}
                                                                                            </p>
    
                                                                                            <div className="ml-auto d-flex">
                                                                                                <button
                                                                                                    onClick={() => {
                                                                                                        setIndexCustomMessageToUpdate(index)
                                                                                                        setNodeDataCustomTemp(variant)
                                                                                                        setMessagePersonnalizedNewVariantUpdate(true)
                                                                                                        setMessagePersonnalizedNewVariantCreation(true) 
                                                                                                    }}
                                                                                                    className="bg-white mr-1" style={{ border: "0px" }}
                                                                                                >
                                                                                                    <i className="feather-edit me-1 font-xs text-grey-500 mr-2"></i>
                                                                                                </button>
    
                                                                                                <button 
                                                                                                    onClick={() => { 
                                                                                                        setRefreshVariant(true)
                                                                                                        nodeDataLabelSelected.custom.splice(index, 1)
                                                                                                        setTimeout(() => {
                                                                                                            setRefreshVariant(false)
                                                                                                        }, 250)
                                                                                                    }}
                                                                                                    className="bg-white" style={{ border: "0px" }}
                                                                                                >
                                                                                                    <i className="ti-trash font-xs text-danger"></i>
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
    
                                                                                    </div>
                                                                                )}
                                                                                </Draggable>
                                                                            ))}
                                                                            {provided.placeholder}
                                                                            </div>
                                                                        )}
                                                                        </Droppable>
                                                                    </DragDropContext>

                                                                )}

                                                                
                                                            </>
                                                        )
                                                    }
                                        
                                                    <button
                                                        className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-white font-xsss fw-600 ls-lg text-current border border-primary mt-2 pb-2 mb-4"
                                                        onClick={() => {
                                                            setMessagePersonnalizedNewVariantCreation(true)
                                                        }}
                                                    >
                                                        <i className="feather-plus mr-2"></i> Ajouter une Nouvelle Variante
                                                    </button>
                                                </>
                                            )}

                                            
                                        </div>
                                    </div>
                                </>
                            )                 
                        )}
                    </div>

                    <div>
                        {(!createTagMode && !messagePersonnalizedLabelEdit && !messagePersonnalizedNewVariantCreation) && (
                            <>
                                { nodeTypeSelected === 'MessagePersonnalizedTag' ? (
                                    <button
                                        onClick={() => handleSettingsModal('0', '0', '0')}
                                        className="border-0 btn rounded-6 lh-2 p-3 pl-4 pr-4 mt-0 mb-2 text-grey-800 bg-grey font-xssss text-uppercase fw-600 ls-3 mr-3"
                                    >
                                        <i className='feather feather-chevron-left mr-1'></i> Retour
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleSettingsModal('0', '0', '0')}
                                            className="border-0 btn rounded-6 lh-2 p-3 pl-4 pr-4 mt-0 mb-2 text-white bg-danger font-xssss text-uppercase fw-600 ls-3 mr-3"
                                        >
                                            <i className='feather feather-x mr-1'></i> Annuler
                                        </button>

                                        <button
                                            onClick={() => saveModalAction(nodeIdSelected, nodeDataLabelSelected)}
                                            className="border-0 btn rounded-6 lh-2 p-3 pl-4 pr-4 mt-0 mb-2 text-white bg-current font-xssss text-uppercase fw-600 ls-3 ms-1 ml-2"
                                        >
                                            <i className='feather feather-check mr-1'></i> Enregistrer les Modifications
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
            
        </div>
    );
};

export default DnDFlow;
