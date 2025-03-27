
import React, { useState } from 'react';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Divider, Drawer, message, Input, Typography, Image } from 'antd';
import { ForwardOutlined } from '@ant-design/icons';
import styles from './index.less';
import services from '@/services/demo';
const { addUser, queryUserList, getPromptImageApi, optimizePromptApi } =
  services.UserController;

const OpitmizePrompt: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [optimizePrompt, setOptimizePrompt] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [optimizedImage, setOptimizedImage] = useState<string>('');
    const changeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
    }
    const changeOptimizeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setOptimizePrompt(e.target.value)
    }
    const  optimizePromptFunc = () => {
      console.log(text);
      optimizePromptApi({ "prompt": text }).then(res => {
        console.log(res)
        const {optimized_prompt}  =res;
        if(optimized_prompt){
          setOptimizePrompt(optimized_prompt)
        }
      })
      
    }
    const getImageFunc = (text, cb) => {
      getPromptImageApi({ text}).then(res => {
        const {image_url, image_base64} = res;
        if(image_url||image_base64){
          cb && cb(image_url||image_base64)
          // setImage(image_url||image_base64)
        }else{
          message.error('No image file found')
        }
      })
    }
    const getImageFuncForOptimizePrompt = () => {

    }
    const useOptimizePrompt = () => {
      setText(optimizePrompt)
    }
    return (
      <div>
        <div style={{display: 'flex'}}>
          <div>
          <Input.TextArea value={text} onChange={changeText} rows={4} />
          <Button className={styles.buttonstyle} onClick={() => getImageFunc(text, (img: string) => setImage(img))} type="primary">Get Image</Button>
          {
          image && <div>
            <Image
          width={200}
          src={image}
        />
          </div>
      
        }
          </div>
       

        <Button className={styles.buttonstyle} onClick={optimizePromptFunc} type="primary">Optimize Prompt<ForwardOutlined /></Button>
        <div>
        <Input.TextArea value={optimizePrompt} onChange={changeOptimizeText} rows={4} />
        <Button className={styles.buttonstyle} onClick={() => getImageFunc(optimizePrompt, (img: string) => setOptimizedImage(img))} type="primary">Get Image By optimized Promot</Button>
        {
        optimizedImage && <Image
        width={200}
        src={optimizedImage}
        />
        }</div>
        </div>
        
        
        {/* {
          optimizePrompt && <div className={styles.prompt}>
            <Typography.Paragraph copyable>{optimizePrompt}</Typography.Paragraph>
            <Divider />
            <Button className={styles.buttonstyle} onClick={useOptimizePrompt} type="primary">use optimize prompt</Button>
            </div>
        } */}
        
      </div>
    )
  }


const TextToImagePage: React.FC = () => {
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <OpitmizePrompt />
      </div>
    </PageContainer>
  );
};





export default TextToImagePage;
