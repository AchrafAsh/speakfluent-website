import Link from 'next/link'

const Footer: React.FC = () => {
    return (
        <footer>
            <div className='py-24'>
                <img
                    src='/images/footer.png'
                    className='absolute inset-x-0 md:relative w-full'
                />
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
                <div className='text-center py-6'>
                    <small className='font-thin text-center'>
                        built from ENSTA Paris by Achraf ASH
                    </small>
                </div>
            </div>
        </footer>
    )
}

export default Footer
