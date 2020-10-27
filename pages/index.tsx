import Head from 'next/head'
import { FormEvent, useState } from 'react'
import Link from 'next/link'

const Home: React.FC = () => {
    const [status, setStatus] = useState('')
    function newsletterSubmit(event: FormEvent<HTMLFormElement>) {
        setStatus('LOADING')
        event.preventDefault()
        const form = event.currentTarget
        const data = new FormData(form)
        const xhr = new XMLHttpRequest()
        xhr.open(form.method, form.action)
        xhr.setRequestHeader('Accept', 'application/json')
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) return
            if (xhr.status === 200) {
                form.reset()
                setStatus('SUCCESS')
            } else {
                setStatus('ERROR')
            }
        }
        xhr.send(data)
    }

    return (
        <div className='max-w-6xl mx-auto'>
            <Head>
                <title>
                    Speak Fluent: Evaluate your pronunciation. Become fluent.
                </title>
                <link rel='icon' href='/images/logo-color.png' />
            </Head>
            <div className='my-12'>
                <img src='/images/logo-color.png' className='h-10 w-10' />
            </div>
            <section id='hero' className=''>
                <div className='flex flex-row'>
                    <div id='hero-text' className='w-full'>
                        <div className='mb-6'>
                            <h1 className='font-black text-3xl uppercase'>
                                Evaluate your pronunciation. <br />
                                Become fluent.
                            </h1>
                            <p className='font-hairline'>
                                Integrate a simple widget to help your users
                                improve their pronunciation
                            </p>
                        </div>
                        <div>
                            <p>Get the latest update about speakfluent.li</p>
                            <form
                                onSubmit={newsletterSubmit}
                                action='https://formspree.io'
                                method='POST'
                            >
                                <div className='border border-gray-400 rounded-lg overflow-hidden flex flex-row max-w-sm my-3 shadow'>
                                    <input
                                        type='email'
                                        name='email'
                                        id='email'
                                        placeholder='Your email'
                                        className='outline-none px-4 py-2 flex-grow'
                                        disabled={status === 'LOADING'}
                                    />
                                    {status === 'LOADING' ? (
                                        <div className='px-6 pt-3 bg-green-400 text-white flex'>
                                            <div className='w-3 h-3 rounded-full animate-bounce bg-gray-200 opacity-75'></div>
                                        </div>
                                    ) : (
                                        <input
                                            type='submit'
                                            value='subscribe'
                                            className='px-4 bg-green-400 text-white cursor-pointer'
                                        />
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                    <div id='hero-widget' className='w-full'>
                        <div className='flex flex-col items-center'>
                            <div className='rounded-full p-6 bg-green-200 w-64 h-64 mx-auto'>
                                <div className='w-full h-full rounded-full bg-green-400 flex justify-center items-center'>
                                    <div
                                        id='widget'
                                        className='bg-white p-3 shadow-md border border-gray-400 rounded-lg flex flex-col items-center space-y-6'
                                    >
                                        <div className='flex flex-row items-center justify-between bg-gray-200 rounded pr-3'>
                                            <div className='px-6 py-1'>
                                                read
                                            </div>
                                            <select
                                                name='label'
                                                id='label'
                                                className='px-6 bg-gray-200 font-semibold'
                                            >
                                                <option value='have'>
                                                    have
                                                </option>
                                                <option value='house'>
                                                    house
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <button className='outline-none rounded-full p-6 bg-gray-200'>
                                                <img
                                                    src='/images/mic.png'
                                                    alt=''
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className=''>
                                <img src='/images/arrow.svg' />
                                <div className='px-4 text-lg text-center'>
                                    try it now!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id='value-props' className='my-20'>
                <div className='grid grid-cols-2 gap-10 max-w-4xl mx-auto'>
                    <ValueProp
                        color='orange-200'
                        icon='/images/detective.png'
                        title='Analyze your pronunciation'
                        description='Thanks to our attention mechanism, get feedback on your mistakes.'
                    />
                    <ValueProp
                        icon='/images/up.png'
                        color='blue-200'
                        title='Fitted for every level'
                        description='lorem ipsum'
                    />
                    <ValueProp
                        color='red-200'
                        icon='/images/rocket.png'
                        title='Speak like a native in no time!'
                        description='lorem ipsum'
                    />
                    <ValueProp
                        color='green-200'
                        icon='/images/mic.png'
                        title='Ready to use widget'
                        description='Simply integrate our plugin to let your users record themselves.'
                    />
                </div>
            </section>
            <footer className='mt-24'>
                <div className='my-24'>
                    <img src='/images/footer.png' className='w-full' />
                </div>
                <div>
                    <div className='flex flex-row justify-between'>
                        <div>
                            <b>Speak Fluent</b>
                            <br />
                            <small className='font-hairline'>© 2020</small>
                        </div>
                        <div>
                            <Link href='/'>
                                <a>
                                    <img src='/images/logo.svg' alt='' />
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div className='text-center my-6'>
                        <small className='font-thin text-center'>
                            built from ENSTA Paris by Achraf ASH
                        </small>
                    </div>
                </div>
            </footer>
        </div>
    )
}

const ValueProp: React.FC<{
    icon: string
    title: string
    description: string
    color: string
}> = ({ icon, title, description, color }) => {
    return (
        <div className='flex flex-row space-x-6'>
            <div
                className={`bg-${color} rounded-full w-16 h-16 flex justify-center items-center`}
            >
                <img src={icon} alt='' />
            </div>
            <div className='max-w-xs'>
                <h3 className='font-semibold mb-1'>{title}</h3>
                <p className='font-light'>{description}</p>
            </div>
        </div>
    )
}

export default Home
