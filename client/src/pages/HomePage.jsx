import SideBar from '../components/SideBar';
import ChatContainer from '../components/ChatContainer';
import RightSideBar from '../components/RightSideBar';
import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';

function HomePage() {

  const { selectedUser } = useContext(ChatContext);

  return (
    <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>

      <div className={`grid backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full relative 
        ${selectedUser 
          ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' 
          : 'md:grid-cols-2'
        }`}>

        {/* Sidebar */}
        <SideBar />

        {/* Chat */}
        <ChatContainer />

        {/* Right Sidebar */}
        {selectedUser && <RightSideBar />}

      </div>

    </div>
  );
}

export default HomePage;