//@ts-nocheck


import React from 'react';

export default () => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside>
            <div className="description">{"Drag & Drop"}</div>
            <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'BeginType')} draggable>
                1er Message (limité à 1)
            </div>
            <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'TeacherMessage')} draggable>
                Message
            </div>
            <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'EndType')} draggable>
                Message de Fin
            </div>

            <div className="description">{"Questions"}</div>
            <div className="dndnode border-warning" onDragStart={(event) => onDragStart(event, 'QuestionType')} draggable>
                Question
            </div>
            <div className="dndnode answer" onDragStart={(event) => onDragStart(event, 'AnswerType')} draggable>
                Choix Réponse Élève
            </div>

            <div className="description">{"Personnalisation"}</div>
            <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'MessagePersonnalizedTag')} draggable>
                Message Personnalisé
            </div>
            <div className="dndnode input border-warning" onDragStart={(event) => onDragStart(event, 'TagsConditionBegin')} draggable>
                Tags
            </div>
            <div className="dndnode input border-success" onDragStart={(event) => onDragStart(event, 'TagCondition')} draggable>
                Condition Si Tag
            </div>

            <div className="description">{"Actions"}</div>
            <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'AddTagToUser')} draggable>
                Ajouter un Tag à l'élève
            </div>
            <div className="dndnode input border-danger" onDragStart={(event) => onDragStart(event, 'RemoveTagToUser')} draggable>
                Enlever un Tag à l'élève
            </div>
        </aside>
    );
};
