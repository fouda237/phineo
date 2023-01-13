import {conditionsTypes} from "../../../../types/enums/conditionsTypesEnum";

import React from 'react';

const initialState = {
    "quizTitle": "",
    "quizSynopsis": "",
    "questions": [
        {
            "question": "",
            "questionType": "text",
            "answerSelectionType": "multiple",
            "answers": [
                "",
                "",
                "",
                "",
            ],
            "correctAnswer": [1],
            "messageForCorrectAnswer": "",
            "messageForIncorrectAnswer": "",
            "explanation": "",
            "point": "1"
        },
    ]
}

const CreateQuizModule = ({value, updateQuiz, updateMode, moduleDetails}: any) => {
    const [quizData, setQuizData] = React.useState(value?.questions ? value : initialState);

    const add_question = () => {
        setQuizData({
            ...quizData,
            questions: [...quizData.questions, {
                "question": "",
                "questionType": "text",
                "answerSelectionType": "multiple",
                "answers": [
                    "",
                    "",
                ],
                "correctAnswer": [1],
                "messageForCorrectAnswer": "",
                "messageForIncorrectAnswer": "",
                "explanation": "",
                "point": "1"
            },]
        })
    }

    const update_question = (question_id: number, value: string) => {
        const current_questions_state = quizData.questions
        current_questions_state[question_id].question = value;
        setQuizData({...quizData, questions: current_questions_state})
    }

    const update_correct_answer = (question_id: number, value: string) => {
        const current_questions_state = quizData.questions
        current_questions_state[question_id].messageForCorrectAnswer = value;
        setQuizData({...quizData, questions: current_questions_state})
    }

    const update_incorrect_answer = (question_id: number, value: string) => {
        const current_questions_state = quizData.questions
        current_questions_state[question_id].messageForIncorrectAnswer = value;
        setQuizData({...quizData, questions: current_questions_state})
    }

    const update_explanation = (question_id: number, value: string) => {
        const current_questions_state = quizData.questions
        current_questions_state[question_id].explanation = value;
        setQuizData({...quizData, questions: current_questions_state})
    }

    const delete_question = (question_id: number) => {
        const current_questions_state = quizData.questions
        current_questions_state.splice(question_id, 1);
        setQuizData({...quizData, questions: current_questions_state})
    }

    const add_answer = (question_id: number) => {
        const current_questions_state = quizData.questions
        current_questions_state[question_id].answers.push("");
        setQuizData({...quizData, questions: current_questions_state})
    }

    const update_answer = (question_id: number, answer_id: number, value: string) => {
        const current_questions_state = quizData.questions
        current_questions_state[question_id].answers[answer_id] = value;
        setQuizData({...quizData, questions: current_questions_state})
    }

    const delete_answer = (question_id: number, answer_id: number) => {
        const current_questions_state = quizData.questions
        current_questions_state[question_id].answers.splice(answer_id, 1);
        setQuizData({...quizData, questions: current_questions_state})
    }

    const select_good_answer = (question_id: number, answer_id: number) => {
        const current_questions_state = quizData.questions
        current_questions_state[question_id].correctAnswer = editCorrectAnswerString(current_questions_state[question_id].correctAnswer, answer_id)
        setQuizData({...quizData, questions: current_questions_state})
    }

    const editCorrectAnswerString = (correctAnswer: number[], answer_id: number) => {
        if (correctAnswer.indexOf(answer_id) >= 0){
            const index = correctAnswer.indexOf(answer_id);
            correctAnswer.splice(index, 1);
        } else {
            correctAnswer.push(answer_id)
        }
        return correctAnswer
    }

    return (
        <>
            {(updateMode && moduleDetails.conditions.type === conditionsTypes.PERCENT && moduleDetails.conditions.conditionValue) && (
                <div className="col-md-12 labelQuizzPercent">
                    <label>Soit {Math.floor(quizData.questions.length * (moduleDetails.conditions.conditionValue / 100))} Bonne{(quizData.questions.length * (moduleDetails.conditions.conditionValue / 100)) >= 2 && 's'} Réponse{(quizData.questions.length * (moduleDetails.conditions.conditionValue / 100)) >= 2 && 's'} sur {quizData.questions.length} Questions </label>
                </div>
            )}
            {(!updateMode && moduleDetails.conditions.type === conditionsTypes.PERCENT && moduleDetails.conditions.value) && (
                <div className="col-md-12 labelQuizzPercent">
                    <label>Soit {Math.floor(quizData.questions.length * (moduleDetails.conditions.value / 100))} Bonne{(quizData.questions.length * (moduleDetails.conditions.value / 100)) >= 2 && 's'} Réponse{(quizData.questions.length * (moduleDetails.conditions.value / 100)) >= 2 && 's'} sur {quizData.questions.length} Questions </label>
                </div>
            )}
            <div className="col-md-12">
                <h2 className="text-grey-900 font-md mb-4 fw-700">Création du Quiz</h2>
            </div>

            {
                quizData.questions.map((question: { question: string, messageForCorrectAnswer: string, messageForIncorrectAnswer: string, explanation: string, answers: [string] }, question_id: number) => {
                    return (
                        <>
                            <div className='col-md-12 bg-lightblue pt-3 pl-4 pr-4 mb-3'> 
                                <div className="form-group mb-1">
                                    <div className="d-flex">
                                        <h2 className="text-grey-900 font-xs fw-700">Question n° {question_id+1}</h2>
                                        <div className="actions ml-auto">
                                            <span className="text-danger font-xsss fw-600" onClick={() => delete_question(question_id)} style={{ cursor: 'pointer' }}>
                                                 <i className="feather-trash-2 mr-1"></i> Supprimer la Question {question_id+1}
                                            </span>
                                        </div>
                                    </div>
                                    <input 
                                        placeholder={`Question n° ${question_id+1} *`}
                                        className="form-control form_control"
                                        value={question.question}
                                        onChange={(e) => update_question(question_id, e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {
                                question.answers.map((answer, answer_id) => {
                                    return (
                                        <div className='col-md-6' key={answer_id}> 
                                            <div className="form-group mb-1">
                                                <div className="d-flex">
                                                    <label
                                                        htmlFor="product_sku"
                                                        className="form-label"
                                                    >
                                                        Réponse n° {answer_id+1}
                                                    </label>
                                                    <div className="actions ml-auto">
                                                        {quizData.questions[question_id].correctAnswer.find((element: number) => element == answer_id+1) ? (
                                                            <span className="text-success font-xsss mr-4" onClick={() => select_good_answer(question_id, answer_id+1)} style={{ cursor: 'pointer' }}>
                                                                <i className="feather-check-square fw-800 mr-1"></i> Réponse Correcte
                                                            </span>
                                                        ) : (
                                                            <span className="text-warning font-xsss mr-4" onClick={() => select_good_answer(question_id, answer_id+1)} style={{ cursor: 'pointer' }}>
                                                                <i className="feather-square fw-800 mr-1"></i> Réponse Fausse
                                                            </span>
                                                        )} 
                                                        <span className="text-danger font-xsss" onClick={() => delete_answer(question_id, answer_id)} style={{ cursor: 'pointer' }}>
                                                            <i className="feather-trash-2 mr-1"></i> Supprimer
                                                        </span>
                                                    </div>
                                                </div>
                                                <input 
                                                    placeholder={`Réponse n° ${answer_id+1} *`}
                                                    className="form-control form_control"
                                                    value={answer}
                                                    onChange={(e) => update_answer(question_id, answer_id, e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            }

                            <div className='col-md-12'> 
                                <div className="form-group mb-1">
                                    <a
                                        onClick={() => add_answer(question_id)}
                                        className="btn p-2 lh-24 pr-3 pl-3 ls-3 d-inline-block rounded-xl bg-primary-blue border-primary font-xssss fw-600 ls-lg text-primary mb-3"
                                    >
                                        <i className="feather-plus mr-0"></i> Ajouter une Réponse
                                    </a>
                                </div>
                            </div>

                            <div className="col-md-12 bg-lightgreen pt-3 pl-4 pr-4 mb-3">
                                <div className="form-group mb-1">
                                    <label
                                        htmlFor="product_sku"
                                        className="form-label"
                                    >
                                        Message à Afficher si Réponse Correcte
                                    </label>
                                    <input 
                                        placeholder="Message à Afficher si Réponse Correcte (optionnel)"
                                        className="form-control form_control"
                                        value={question.messageForCorrectAnswer}
                                        onChange={(e) => update_correct_answer(question_id, e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-12 bg-lightred pt-3 pl-4 pr-4 mb-3">
                                <div className="form-group mb-1">
                                    <label
                                        htmlFor="product_sku"
                                        className="form-label"
                                    >
                                        Message à Afficher si Réponse Fausse
                                    </label>
                                    <input 
                                        placeholder="Message à Afficher si Réponse Fausse (optionnel)"
                                        className="form-control form_control"
                                        value={question.messageForIncorrectAnswer}
                                        onChange={(e) => update_incorrect_answer(question_id, e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-12 bg-lightgrey pt-3 pl-4 pr-4 mb-3">
                                <div className="form-group mb-1">
                                    <label
                                        htmlFor="product_sku"
                                        className="form-label"
                                    >
                                        Explication de la Réponse
                                    </label>
                                    <textarea 
                                        placeholder="Explication de la Réponse *"
                                        className="form-control form_control"
                                        value={question.explanation}
                                        onChange={(e) => update_explanation(question_id, e.target.value)}
                                        rows={5}
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )
                })}
                <div className="col-md-12" style={{ marginBottom: '80px'}}>
                    <div className="form-group mb-1">
                        <a
                            onClick={add_question}
                            className="btn p-3 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-skype text-white font-xsss fw-600 ls-lg mb-3"
                        >
                            <i className="feather-plus mr-0"></i> Ajouter une Question
                        </a>
                    </div>
                </div>

                <div className="stickyBtn col-md-12 pr-3 pl-3 pb-3 pt-0">
                    <hr className="my-6 mt-0" />
                    <button
                        type="submit"
                        onClick={() => updateQuiz(quizData)}
                        className="p-0 btn p-3 lh-24 pl-4 pr-4 ls-3 d-inline-block rounded-xl bg-skype font-xsss fw-600 ls-lg text-white mt-2 pb-2"
                    >
                        <i className="feather-check mr-2"></i> {!updateMode ? 'Créer ' : 'Mettre à Jour '}le Module de Quiz
                    </button>
                </div>
                
        </>
    );
};

export default CreateQuizModule;
