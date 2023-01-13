import clsx from "clsx";
import React, { Component } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { getItemStyle, getAnswerListStyle } from "./utils";

const Answers = props => {
  const { section, sectionNum } = props;
  return (
    <Droppable droppableId={`droppable${section.id}`} type={`${sectionNum}`}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          style={getAnswerListStyle(snapshot.isDraggingOver)}
        >
          {section.modules.map((module, index) => {
            return (
              <Draggable
                key={`${sectionNum}${index}`}
                draggableId={`${sectionNum}${index}`}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={clsx("p-2 rounded-lg font-light text-sm text-left w-4/5 cursor-pointer hover:bg-gray-800")}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    <span {...provided.dragHandleProps}>
                    {module.title}
                    </span>
                  </div>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Answers;
