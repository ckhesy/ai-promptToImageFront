
import React, { useState } from 'react';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Divider, Drawer, message, Input, Typography, Image } from 'antd';
import styles from './index.less';
import services from '@/services/demo';
const { addUser, queryUserList, getPromptImageApi, optimizePromptApi } =
  services.UserController;

const OpitmizePrompt: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [optimizePrompt, setOptimizePrompt] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const changeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(trim(e.target.value));
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
    const getImageFunc = () => {
      getPromptImageApi({ text}).then(res => {
        const {image_url} = res;
        if(image_url){
          setImage(image_url)
        }
      })
    }
    const useOptimizePrompt = () => {
      setText(optimizePrompt)
    }
    return (
      <div>
        <Input.TextArea value={text} onChange={changeText} rows={4} />
        <Button className={styles.buttonstyle} onClick={optimizePromptFunc} type="primary">Optimize Prompt</Button>
        <Button className={styles.buttonstyle} onClick={getImageFunc} type="primary">Get Image</Button>
        {
          optimizePrompt && <div className={styles.prompt}>
            <Typography.Paragraph copyable>{optimizePrompt}</Typography.Paragraph>
            <Divider />
            <Button className={styles.buttonstyle} onClick={useOptimizePrompt} type="primary">use optimize prompt</Button>
            </div>
        }
        {
          image && <Image
          width={200}
          src={image}
        />
      
        }
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
