import { useState } from 'react'
import Recorder from 'recorder-js'

type Status = 'INIT' | 'RECORDING' | 'LOADING' | 'SCORE' | 'ERROR'

const labels = ['have', 'home', 'house', 'car', 'cat']

const Widget: React.FC = () => {
    const [status, setStatus] = useState<Status>('INIT')
    const [audioURL, setAudioURL] = useState('')
    const [label, setLabel] = useState<typeof labels[number]>(labels[0])
    const [score, setScore] = useState<number[]>([])
    const [recorder, setRecorder] = useState<undefined | Recorder>()

    function startRecording() {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                const audioContext = new window.AudioContext()
                let recorder = new Recorder(audioContext, {
                    // An array of 255 Numbers
                    // You can use this to visualize the audio stream
                    // If you use react, check out react-wave-stream
                    // onAnalysed: (data) => console.log(data)
                })
                recorder.init(stream)
                recorder.start()
                setStatus('RECORDING')
                setRecorder(recorder)
            })
            .catch((error) => {
                console.log(error)
                alert('Please allow microphone to try the widget 🙏')
            })
    }

    function stopRecording() {
        if (recorder)
            recorder.stop().then(({ blob, buffer }) => {
                blob = blob
                console.log('stop recording')
                setStatus('LOADING')
                getScore(blob)
            })
    }

    async function getScore(blob: Blob) {
        setStatus('LOADING')
        console.log('ready to post')
        setAudioURL(window.URL.createObjectURL(blob))

        try {
            // post file to REST API prediction endpoint
            const formData = new FormData()
            formData.append('word', label)
            console.log({ blob, audioURL })
            formData.append('audio', blob, label)

            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                mode: 'cors',
                body: formData
            })

            console.log({ response })

            const { score } = await response.json()
            setScore(score)
        } catch (error) {
            console.log(error)
        }

        setStatus('SCORE')
    }

    function handleClick() {
        switch (status) {
            case 'INIT':
                return startRecording()
            case 'LOADING':
                return null
            case 'SCORE':
                return null
            case 'RECORDING':
                return stopRecording()
            default:
                return null
        }
    }

    return (
        <div>
            <div
                id='widget'
                className='bg-white p-3 shadow-md border border-gray-400 rounded-lg flex flex-col items-center space-y-6'
            >
                <div className='flex flex-row items-center justify-between bg-gray-200 rounded pr-3'>
                    <div className='px-6 py-1'>read</div>
                    <select
                        name='label'
                        id='label'
                        className='px-6 bg-gray-200 font-semibold'
                        value={label}
                        onChange={(e) => setLabel(e.currentTarget.value)}
                    >
                        {labels.map((label) => (
                            <option key={label} value={label}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    {status === 'SCORE' ? (
                        <div className='flex flex-col space-y-3 items-end'>
                            <button
                                className='w-3 h-3'
                                onClick={() => setStatus('INIT')}
                            >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 492 492'
                                >
                                    <path d='M300.188 246L484.14 62.04c5.06-5.064 7.852-11.82 7.86-19.024 0-7.208-2.792-13.972-7.86-19.028L468.02 7.872C462.952 2.796 456.196.016 448.984.016c-7.2 0-13.956 2.78-19.024 7.856L246.008 191.82 62.048 7.872C56.988 2.796 50.228.016 43.02.016c-7.2 0-13.96 2.78-19.02 7.856L7.872 23.988c-10.496 10.496-10.496 27.568 0 38.052L191.828 246 7.872 429.952C2.808 435.024.02 441.78.02 448.984c0 7.204 2.788 13.96 7.852 19.028l16.124 16.116c5.06 5.072 11.824 7.856 19.02 7.856 7.208 0 13.968-2.784 19.028-7.856l183.96-183.952 183.952 183.952c5.068 5.072 11.824 7.856 19.024 7.856h.008c7.204 0 13.96-2.784 19.028-7.856l16.12-16.116c5.06-5.064 7.852-11.824 7.852-19.028 0-7.204-2.792-13.96-7.852-19.028L300.188 246z' />
                                </svg>
                            </button>
                            <div className='w-full text-center'>
                                {label.split('').map((letter, idx) => (
                                    <span
                                        className={`bg-red-${
                                            score[idx] < 0.25
                                                ? '500 text-gray-200'
                                                : score[idx] < 0.5
                                                ? '300 text-gray-300'
                                                : '100 text-gray-600'
                                        } p-1`}
                                        key={idx}
                                    >
                                        {letter}
                                    </span>
                                ))}
                            </div>
                            <audio controls className='w-48'>
                                <source src={audioURL} type='audio/wav' />
                                Your browser does not support the audio tag.
                            </audio>
                        </div>
                    ) : (
                        <button
                            onClick={handleClick}
                            className='outline-none rounded-full p-6 bg-gray-200'
                        >
                            {status === 'INIT' ? (
                                <img src='/images/mic.png' alt='play button' />
                            ) : status === 'RECORDING' ? (
                                <img src='/images/stop.png' alt='stop button' />
                            ) : status === 'LOADING' ? (
                                <div className='w-6 h-6'>
                                    <Loader />
                                </div>
                            ) : null}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

const Loader: React.FC = () => {
    return (
        <svg
            viewBox='0 0 135 140'
            xmlns='http://www.w3.org/2000/svg'
            fill='#68D391'
        >
            <rect y='10' width='15' height='120' rx='6'>
                <animate
                    attributeName='height'
                    begin='0.5s'
                    dur='1s'
                    values='120;110;100;90;80;70;60;50;40;140;120'
                    calcMode='linear'
                    repeatCount='indefinite'
                />
                <animate
                    attributeName='y'
                    begin='0.5s'
                    dur='1s'
                    values='10;15;20;25;30;35;40;45;50;0;10'
                    calcMode='linear'
                    repeatCount='indefinite'
                />
            </rect>
            <rect x='30' y='10' width='15' height='120' rx='6'>
                <animate
                    attributeName='height'
                    begin='0.25s'
                    dur='1s'
                    values='120;110;100;90;80;70;60;50;40;140;120'
                    calcMode='linear'
                    repeatCount='indefinite'
                />
                <animate
                    attributeName='y'
                    begin='0.25s'
                    dur='1s'
                    values='10;15;20;25;30;35;40;45;50;0;10'
                    calcMode='linear'
                    repeatCount='indefinite'
                />
            </rect>
            <rect x='60' width='15' height='140' rx='6'>
                <animate
                    attributeName='height'
                    begin='0s'
                    dur='1s'
                    values='120;110;100;90;80;70;60;50;40;140;120'
                    calcMode='linear'
                    repeatCount='indefinite'
                />
                <animate
                    attributeName='y'
                    begin='0s'
                    dur='1s'
                    values='10;15;20;25;30;35;40;45;50;0;10'
                    calcMode='linear'
                    repeatCount='indefinite'
                />
            </rect>
            <rect x='90' y='10' width='15' height='120' rx='6'>
                <animate
                    attributeName='height'
                    begin='0.25s'
                    dur='1s'
                    values='120;110;100;90;80;70;60;50;40;140;120'
                    calcMode='linear'
                    repeatCount='indefinite'
                />
                <animate
                    attributeName='y'
                    begin='0.25s'
                    dur='1s'
                    values='10;15;20;25;30;35;40;45;50;0;10'
                    calcMode='linear'
                    repeatCount='indefinite'
                />
            </rect>
            <rect x='120' y='10' width='15' height='120' rx='6'>
                <animate
                    attributeName='height'
                    begin='0.5s'
                    dur='1s'
                    values='120;110;100;90;80;70;60;50;40;140;120'
                    calcMode='linear'
                    repeatCount='indefinite'
                />
                <animate
                    attributeName='y'
                    begin='0.5s'
                    dur='1s'
                    values='10;15;20;25;30;35;40;45;50;0;10'
                    calcMode='linear'
                    repeatCount='indefinite'
                />
            </rect>
        </svg>
    )
}

export default Widget
