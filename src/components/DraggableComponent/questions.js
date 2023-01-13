import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Reorder, getItemStyle, getQuestionListStyle, getAnswerListStyle } from "./utils";
import Answers from "./answer";
import clsx from "clsx";
import Icon from "../../assets/images/delete.png"
import { FcBookmark } from "react-icons/fc";

class Sections extends Component {
    constructor(props) {
        super(props);

        // console.log("PROPS",props);

        this.state = {
            sections: props.course.sections
        };
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            //console.log("no-change");
            return;
        }

        if (result.type === "SECTIONS") {
            console.log(result);
            const sections = Reorder(
                this.state.sections,
                result.source.index,
                result.destination.index
            );

            this.setState({
                sections
            });
        } else {
            const modules = Reorder(
                this.state.sections[parseInt(result.type, 10)].modules,
                result.source.index,
                result.destination.index
            );

            const sections = JSON.parse(JSON.stringify(this.state.sections));

            sections[result.type].modules = modules;

            this.setState({
                sections
            });
        }
    }

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        return (
            <DragDropContext
                onDragEnd={this.onDragEnd}
                onDragUpdate={this.onDragUpdate}
            >
                <Droppable droppableId="droppable" type="SECTIONS">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                        >
                            {this.state.sections.map((section, index) => (
                                <Draggable
                                    key={section.id}
                                    draggableId={section.id}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}
                                        >
                                            <div {...provided.dragHandleProps} className={"w-full flex"}>
                                                <FcBookmark />
                                                <span
                                                    className={clsx("text-left flex flex-row items-center w-full  transition-all rounded-md cursor-pointer",
                                                        "justify-center",
                                                        "hover:bg-gray-800",
                                                    )}
                                                    onClick={() => this.props.navigateTo(`/admin/course/${this.props.course.id}/section/${section.id}`)}>
                                                    {section.title}
                                                </span>
                                                <button className={clsx('text-white', 'cursor-pointer', "w-1/6", "p-1")} onClick={() => this.props.deleteSection(section.id)}>
                                                    <img src={Icon} alt={"icon"} className={"w-full"} />
                                                </button>
                                            </div>
                                            <div className={"w-full pl-8"}>
                                                <Droppable droppableId={`droppable${section.id}`} type={`${index}`}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            style={getAnswerListStyle(snapshot.isDraggingOver)}
                                                        >
                                                            {section.modules.map((module, index) => {
                                                                return (
                                                                    <Draggable
                                                                        key={`${index}${index}`}
                                                                        draggableId={`${index}${index}`}
                                                                        index={index}
                                                                    >
                                                                        {(provided, snapshot) => (
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                className={clsx("w-full flex")}
                                                                                style={getItemStyle(
                                                                                    snapshot.isDragging,
                                                                                    provided.draggableProps.style
                                                                                )}
                                                                            >
                                                                                <span {...provided.dragHandleProps}
                                                                                    className={clsx("p-2 rounded-lg font-light text-sm text-left w-4/5 cursor-pointer hover:bg-gray-800")}
                                                                                    onClick={() => this.props.navigateTo(`/admin/course/${this.props.course.id}/section/${section.id}/module/${module.id}`)}>
                                                                                    {module.title}
                                                                                </span>
                                                                                <button className={clsx('text-white', 'cursor-pointer', "w-1/6", "p-1")}
                                                                                    onClick={() => this.props.deleteModule(section.id, module.id)}>
                                                                                    <img src={Icon} alt={"icon"} className={"w-full"} />
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </Draggable>
                                                                );
                                                            })}
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>
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
        );
    }
}

export default Sections;
