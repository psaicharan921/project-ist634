import React from 'react'

export default function ContactUs() {
  return (
    <div className='page'>
      <div className='App-header'>Contact Us</div>
      <div className='confirmation-box'>
      <div className='info1'>
        <div className='feedback'>
          <div className='val'>
            <label>Email - 1 </label>
            <a className='con'  href = "mailto:saicharanpasupuleti@gmail.com?subject = Issue = Message">
            saicharanpasupuleti@gmail.com
            </a>
          </div>
          <div className='val'>
            <label>Email - 2 </label>
            <a className='con'  href = "mailto:yuvarajreddysanagala@gmail.com?subject = Issue = Message">
            yuvarajreddysanagala@gmail.com
            </a>
          </div>
        </div>
        <div className='feedback'>
          <div className='val'>
            <label>Tollfree -1 </label>
            <a className='con' href='Tel:+1-(445)-680-9846'>
            +1-(445)-680-9846
            </a>
          </div>
          <div className='val'>
            <label>Tollfree -2 </label>
            <a className='con'  href='Tel:+1-(445)-680-9848'>
            +1-(445)-680-9848
            </a>
          </div>
          <div className='val'>
            <label>Tollfree -3 </label>
            <a className='con' href='Tel:+1-(445)-680-9849'>
            +1-(445)-680-9849
            </a>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
