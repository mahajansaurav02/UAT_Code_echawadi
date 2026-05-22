
// import { Button, Result } from 'antd';
// import React from 'react';
// import { history } from 'umi';

// const NoFoundPage = () => (
//   <Result
//     status="404"
//     title="404"
//     subTitle="Sorry, the page you visited does not exist."
//     extra={
//       <Button type="primary" onClick={() => history.push('/')}>
//         Back Home
//       </Button>
//     }
//   />
// );

// export default NoFoundPage;



import { Button, Result } from 'antd';
import React, { useEffect } from 'react';
import { history } from 'umi';

const NoFoundPage = () => {
  
  useEffect(() => {
    const headers = document.querySelectorAll('header');
    headers.forEach(header => {
      header.style.display = 'none';
    });

    return () => {
      headers.forEach(header => {
        header.style.display = '';
      });
    };
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist.."
        extra={
          <Button type="primary" onClick={() => history.goBack()}>
            Go Back
          </Button>
        }
      />
    </div>
  );
};

export default NoFoundPage;