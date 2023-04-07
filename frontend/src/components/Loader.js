import Lottie from 'react-lottie';
import * as animationData from '../assets/lottie/loading.json';


export default function Loader(){
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Lottie
                options={{
                    loop: true,
                    autoplay: true,
                    animationData: animationData,
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                    }
                }}
                style={{
                    height: '100px',
                    width: '100px',
                    cursor: 'default',
                }}
                isStopped={false}
                isPaused={false}
                isClickToPauseDisabled={true}
            />
        </div>
    );
}