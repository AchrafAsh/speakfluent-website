import Head from 'next/head'
import { FormEvent, useState } from 'react'
import Link from 'next/link'
import Widget from '@components/Widget'
import Footer from '@layout/Footer'

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
        <div className='max-w-6xl px-6 md:mx-auto'>
            <Head>
                <title>
                    Speak Fluent: Evaluate your pronunciation. Become fluent.
                </title>
                <link rel='icon' href='/images/logo-color.png' />
            </Head>
            <div className='py-6'>
                <Link href='/'>
                    <a>
                        <img
                            src='/images/logo-color.png'
                            className='w-8 h-8 md:h-10 md:w-10'
                        />
                    </a>
                </Link>
            </div>
            <section id='hero'>
                <div className='flex flex-col space-y-8 md:flex-row md:items-center'>
                    <div id='hero-text' className='w-full'>
                        <div className='mb-6'>
                            <h1 className='font-black text-2xl md:text-3xl uppercase leading-7'>
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
                                <div className='border border-gray-400 rounded-lg overflow-hidden max-w-sm my-3 shadow flex flex-row'>
                                    <input
                                        type='email'
                                        name='email'
                                        id='email'
                                        placeholder='Your email'
                                        className='outline-none px-4 py-2 w-full'
                                        disabled={status === 'LOADING'}
                                    />
                                    {status === 'LOADING' ? (
                                        <div className='px-6 pt-3 bg-green-400 text-white'>
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
                                    <Widget />
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
            <section id='value-props' className='pt-24'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto'>
                    <ValueProp
                        color='orange-200'
                        icon='/images/detective.png'
                        title='Learn from your mistakes'
                        description='See where your pronunciation failed thanks to our attention mechanism.'
                    />
                    <ValueProp
                        icon='/images/brain.png'
                        color='blue-200'
                        title='Always getting better'
                        description='Your users are constantly improving and so is our AI.'
                    />
                    <ValueProp
                        color='red-200'
                        icon='/images/rocket.png'
                        title='Boost your skills'
                        description='Writing skills are great, but speaking skills are way better.'
                    />
                    <ValueProp
                        color='green-200'
                        icon='/images/mic.png'
                        title='Get started in no time'
                        description='Simply embed our widget and get started right away.'
                    />
                </div>
            </section>
            <section id='contribute' className='pt-24'>
                <div className='text-center'>
                    <h2 className='text-2xl font-semibold mb-3'>
                        Want to help us make{' '}
                        <Link href='/'>
                            <a className='text-green-400'>SpeakFluent</a>
                        </Link>{' '}
                        even better ?
                    </h2>
                    <div>
                        <Link href='/contribute'>
                            <a>
                                contribute
                                <img
                                    src='/images/right-arrow.svg'
                                    className='ml-2 w-3 h-3 mb-1 inline-block'
                                />
                            </a>
                        </Link>
                    </div>
                </div>
            </section>
            <Footer />
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
            <div className='w-2/3 max-w-xs'>
                <h3 className='font-semibold mb-1'>{title}</h3>
                <p className='font-light'>{description}</p>
            </div>
        </div>
    )
}

export default Home
