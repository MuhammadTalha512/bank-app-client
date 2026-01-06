import React from 'react'
import { Col, Row } from 'antd'

const Copyright = () => {
    const year = new Date().getFullYear()
  return (
    <footer className='container-fluid bg-primary text-white'>
      <Row className='my-2 mb-0'>
        <Col span={24} className='text-center'>
        <p className=''>&copy;{year} All Rights Reserved.</p>
        </Col>
      </Row>
    </footer>
  )
}

export default Copyright