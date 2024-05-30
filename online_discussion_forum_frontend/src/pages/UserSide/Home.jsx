import { Box, Button, Typography } from '@mui/material';
import yangaLogo from '../image/yangaLogo.png'
import home_video from '../../video/home_video.mp4'
import { useNavigate } from 'react-router-dom/dist/umd/react-router-dom.development';
import { useEffect, useState } from 'react';

const HomePage = () => {
  const navigate = useNavigate();
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMouseX(event.clientX / window.innerWidth - 0.5);
      setMouseY(event.clientY / window.innerHeight - 0.5);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <header className='h-screen fixed top-0 left-0 flex flex-col items-center content-start z-10'>
        <a href="https://dycihub.vercel.app/" className=''>
          <img className='m-10 mb-5 w-[60px] min-h-[60[x]' src={yangaLogo} alt="" />
        </a>
        <nav className='flex flex-col space-between items-center justify-between' style={{
          flexGrow: '1',
          flexShrink: '1',
          flexBasis: 'auto'
        }}>
          <div style={{
            color: '#ffffff',
            transform: 'rotate(180deg)',
            writingMode: 'vertical-lr',
            display: 'flex'
          }}>
            <a className='relative inline-flex items-center m-5' style={{ lineHeight: '1' }} href=""><Typography fontWeight={800} fontFamily={'Megrim'}>About</Typography></a>
            <a className='relative inline-flex items-center m-5' style={{ lineHeight: '1' }} href=""><Typography fontWeight={800} fontFamily={'Megrim'}>Team</Typography></a>
            <a className='relative inline-flex items-center m-5' style={{ lineHeight: '1' }} href=""><Typography fontWeight={800} fontFamily={'Megrim'}>Contact</Typography></a>
          </div>
          <div className='flex flex-col items-center content-center relative mb-[50px]'>
            <Button variant='outlined' sx={{
              paddingY: '20px',
              position: 'relative',
              margin: '5px'
            }} onClick={() => {
              navigate('/login')
            }}>
              Log In
            </Button>
            <a className='relative inline-flex items-center m-5' style={{ lineHeight: '1' }} href="">
              <svg fill='white' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
                <path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z"></path>
              </svg>
            </a>
            <a className='relative inline-flex items-center m-5' style={{ lineHeight: '1' }} href="">
              <svg fill='white' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30">
                <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
              </svg>
            </a>
          </div>
        </nav>
      </header>
      <main>
        <div className="h-[100%] w-screen absolute top-0 left-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-[100%]"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              height: '100%',
              transform: `translate(${-50 + mouseX * 10}%, ${-50 + mouseY * 10}%) scale(1.1)`,
              objectFit: 'cover',
              zIndex: '-2',
            }}
          >
            <source src={home_video} type="video/mp4" />
          </video>
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: '-1',
            }}
          ></div>
        </div>
        <div className='h-[100dvh] w-[80%] flex flex-col m-auto justify-center'>
          <section className='flex flex-col items-center justify-center'>
            <div className='w-[70%] flex justify-start flex-col'>
              <Typography color={'white'} fontSize={'20px'} fontWeight={500} fontFamily={'Megrim'} sx={{
                marginBottom: '20px'
              }}>
                DYCI HUB: An Online Discussion Forum for DYCIANS
              </Typography>
              <div className='flex justify-start flex-row items-center'>
                <Typography color={'white'} fontSize={'80px'} fontWeight={800} fontFamily={'Megrim'}>
                  Welcome,
                </Typography>
                <span className='h-[1px] w-[120%] ml-10' style={{
                  backgroundColor: '#b8b8b8'
                }}></span>
              </div>
              <Typography color={'white'} fontSize={'80px'} fontWeight={800} fontFamily={'Megrim'}>
                DYCIANS
              </Typography>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default HomePage;
