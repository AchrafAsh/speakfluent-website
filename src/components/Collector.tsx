import { useState } from 'react'
import Recorder from 'recorder-js'
import { Loader } from '@components/Widget'

type Status = 'INIT' | 'RECORDING' | 'LOADING' | 'READY' | 'ERROR' | 'THANK_YOU'

const Collector: React.FC = () => {
    const [status, setStatus] = useState<Status>('INIT')
    const [audioURL, setAudioURL] = useState('')
    const [label, setLabel] = useState('')
    const [blob, setBlob] = useState<Blob | undefined>()
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
                console.log('stop recording')
                setBlob(blob)
                setStatus('LOADING')
                let url = window.URL.createObjectURL(blob)
                setAudioURL(url)
                setTimeout(() => setStatus('READY'), 1000)
            })
    }

    function handleClick() {
        switch (status) {
            case 'INIT':
                return startRecording()
            case 'LOADING':
                return null
            case 'READY':
                return null
            case 'RECORDING':
                return stopRecording()
            default:
                return null
        }
    }

    async function handleSubmit() {
        setStatus('LOADING')
        let url = audioURL.split('/')[3]

        try {
            if (blob === undefined) throw 'No audio found'
            // post file to REST API prediction endpoint
            const formData = new FormData()
            formData.append('word', label)
            formData.append('audio', blob, url)

            const response = await fetch('http://localhost:5000/collect', {
                method: 'POST',
                mode: 'cors',
                body: formData
            })

            setStatus('THANK_YOU')
        } catch (error) {
            console.log(error)
            setStatus('READY')
        }
    }

    return (
        <div className='bg-white p-6 rounded-lg shadow-lg flex flex-col items-center space-y-3'>
            <input
                type='text'
                name='word'
                id='word'
                placeholder='house'
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className='px-6 py-1 text-center shadow-inner rounded-lg'
            />
            {status === 'READY' ? (
                <div className='flex flex-col items-end space-y-3'>
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
                    <audio controls className='w-48'>
                        <source src={audioURL} type='audio/wav' />
                        Your browser does not support the audio tag.
                    </audio>
                    <button
                        type='submit'
                        onClick={handleSubmit}
                        className='bg-gray-200 rounded-md px-6 py-2 w-full'
                    >
                        Submit
                    </button>
                </div>
            ) : status === 'THANK_YOU' ? (
                <div className='flex flex-col items-end space-y-1 w-1/2 pt-3'>
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
                    <div className='text-center w-full'>Thank you!</div>
                    <div className='outline-none rounded-full p-6 bg-red-200 mx-auto'>
                        <img src='/images/hugging.png' alt='hugging face' />
                    </div>
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
    )
}

export default Collector
