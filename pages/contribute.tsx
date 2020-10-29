import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import Collector from '@components/Collector'
import Evaluator, { Sample } from '@components/Evaluator'
import Footer from '@layout/Footer'

const Page: React.FC<{ samples: Sample[] }> = ({ samples }) => {
    return (
        <div className='max-w-6xl px-6 md:mx-auto'>
            <Head>
                <title>Speak Fluent | Contributing</title>
                <link
                    rel='shortcut icon'
                    href='/images/logo.svg'
                    type='image/x-icon'
                />
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
            <section id='intro' className='py-12'>
                <div className='mx-auto'>
                    <div className='text-center text-xl font-semibold'>
                        You can contribute in two ways
                    </div>
                    <div className='py-12 flex flex-col space-y-3 md:flex-row items-center justify-center md:space-x-6 md:space-y-0'>
                        <a
                            className='px-12 py-3 bg-green-400 text-white rounded-md'
                            href='#collect'
                        >
                            Collecting data
                        </a>
                        <a
                            className='px-12 py-3 bg-green-400 text-white rounded-md'
                            href='#label'
                        >
                            Labeling data
                        </a>
                    </div>
                </div>
            </section>
            <section id='collect' className='py-12'>
                <div className='flex flex-col items-center space-y-6'>
                    <ol className='font-semibold'>
                        <li>1. Pick a word</li>
                        <li>2. Record yourself</li>
                        <li>3. Submit</li>
                    </ol>
                    <Collector />
                    <div className='mx-auto text-center'>
                        <small>
                            * make sure you let time before and after you speak
                        </small>
                    </div>
                </div>
            </section>
            <section id='label' className='py-24'>
                <div className='flex flex-col items-center space-y-6'>
                    <ol className='font-semibold'>
                        <li>1. Select a word</li>
                        <li>2. Listen</li>
                        <li>3. Evaluate</li>
                    </ol>
                    <Evaluator samples={samples} />
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default Page

export const getServerSideProps: GetServerSideProps = async (context) => {
    // fetch available labels
    const res = await fetch('http://localhost:5000/labels')
    const { samples } = await res.json()

    return {
        props: {
            samples
        }
    }
}
