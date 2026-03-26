interface DiaryContentProps {
  content: string;
}

const DiaryContent = ({ content }: DiaryContentProps) => {
  // 格式化内容：处理换行和空格
  const formatContent = (text: string) => {
    // 按换行符分割
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // 去除行首的空格和制表符
      const trimmedLine = line.replace(/^[\s\u3000]+/, '');
      
      // 如果是空行，保留
      if (trimmedLine.trim() === '') {
        return <div key={index} className="paragraph" style={{ height: '1em' }}></div>;
      }
      
      // 每一行都作为一个段落，自动首行缩进
      return (
        <div key={index} className="paragraph">
          {trimmedLine}
        </div>
      );
    });
  };

  return (
    <div className="diary-content-formatted text-neutral-text">
      {formatContent(content)}
    </div>
  );
};

export default DiaryContent;

