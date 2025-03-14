import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT<span className='text gray-700 font-medium'> US</span></p>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]'src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt iusto, explicabo porro laboriosam odio mollitia qui facilis assumenda fugit? Qui?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum quae odit nihil, voluptates ut harum, odio voluptate dicta deserunt repellendus pariatur aliquid mollitia beatae et accusantium nostrum ex saepe corrupti provident blanditiis! Eaque, id eum.</p>
        <b className='text-gray-800'>Our Vision</b>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem eius voluptates consequuntur consequatur, voluptas asperiores? Placeat ab consequuntur velit nemo quae laborum nostrum aliquam, eveniet deleniti beatae dolorum quidem voluptatibus.</p>
      </div>
      </div>
      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
      </div>
      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Efficiency:</b>
          <p>stramlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Convenience:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Personlization:</b>
          <p>Tailored recommendation and reminders to help you stay on top of your health.</p>
        </div>
      </div>

    </div>
  )
}

export default About
