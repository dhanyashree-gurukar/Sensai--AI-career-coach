import React from 'react';

const questionList = [
    'What skills do i need for a data analyst role?',
    'How do I switch careers to UX designs?'
]

function EmptyState({selectedQuestion}) {
    return (
        <div>
            <h2 className="font-bold text-xl text-center">Ask anything to AI career Agent</h2>
            <div>
                {questionList.map((question, index) => (
                    <h2 className='p-4 text-center border rounded-lg my-3 hover:border-primary'
                    key={index}
                    onClick={()=>selectedQuestion(question)}>{question}</h2>
                ))}
            </div>
        </div>
    )
}

export default EmptyState;