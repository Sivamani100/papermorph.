import React, { useState } from 'react';
import { 
  MessageSquare, 
  Wand2, 
  Send, 
  Plus,
  Eraser,
  Lightbulb,
  Volume2,
  VolumeX,
  Maximize2,
  Check
} from 'lucide-react';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

interface AIAssistantProps {
  onApplyContent: (content: string) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onApplyContent }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'wizard'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'outline specific concerns, propose suggestions, or provide supporting details.]',
    },
    {
      id: '2',
      role: 'assistant',
      content: 'I kindly request your guidance/approval/action on this matter at your earliest convenience. Please let me know if any additional information is required.',
    },
    {
      id: '3',
      role: 'assistant',
      content: 'Thank you for your attention to this request.',
    },
    {
      id: '4',
      role: 'assistant',
      content: 'Yours sincerely,\n[Your Full Name]\n[Your Position/Role, if applicable]\n[Contact Information, if required]',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
    };
    
    setMessages(prev => [...prev, newMessage]);
    const userQuery = inputValue.toLowerCase();
    setInputValue('');
    
    // Generate dummy response based on user query
    setTimeout(() => {
      let response = '';
      
      if (userQuery.includes('letter') || userQuery.includes('write a letter')) {
        response = `Dear Sir/Madam,

I hope this letter finds you well. I am writing to you today to discuss an important matter that requires your attention.

[Your main content would go here - you can customize this section based on your specific needs]

Thank you for your time and consideration. I look forward to your response and hope we can resolve this matter amicably.

Yours sincerely,
[Your Name]
[Your Position]
[Your Contact Information]`;
      } else if (userQuery.includes('email') || userQuery.includes('mail')) {
        response = `Subject: Important Communication - Action Required

Dear Team,

I hope this email finds you well. I'm reaching out regarding [specific topic] that needs our immediate attention.

Key Points:
• First important point to consider
• Second key item for discussion  
• Third critical action item

Next Steps:
1. Review the attached documents
2. Provide feedback by [date]
3. Schedule follow-up meeting

Please let me know if you have any questions or concerns. I'm available to discuss this further at your convenience.

Best regards,
[Your Name]
[Your Title]
[Your Contact Information]`;
      } else if (userQuery.includes('report') || userQuery.includes('summary')) {
        response = `Executive Summary

This report provides a comprehensive analysis of [topic] for the period [timeframe]. The findings indicate significant opportunities for improvement and growth.

Key Findings:
• Performance metrics show [percentage]% improvement
• Customer satisfaction increased by [percentage]%
• Revenue growth exceeded projections by [percentage]%

Recommendations:
1. Implement strategic initiatives outlined in Section 2
2. Allocate additional resources to high-impact areas
3. Establish regular monitoring and reporting mechanisms

Conclusion:
The data suggests that [conclusion]. With proper implementation of the recommended actions, we expect to see continued positive results.

[Your Name]
[Your Position]
[Date]`;
      } else if (userQuery.includes('story') || userQuery.includes('creative')) {
        response = `The morning sun cast long shadows across the quiet street as Sarah made her way to the old bookstore. She had always been drawn to places where stories seemed to linger in the air, where every shelf held countless adventures waiting to be discovered.

The little bell above the door chimed softly as she entered, and the familiar scent of aged paper and possibility filled her senses. Behind the counter, Mr. Henderson looked up from his reading, his weathered face breaking into a warm smile.

"Good morning, Sarah," he said. "Here for another adventure, are we?"

She nodded, her eyes already scanning the shelves. "I'm looking for something different today. Something... magical."

Mr. Henderson's eyes twinkled. "I have just the thing," he said, reaching beneath the counter. "This one's special. It chooses its readers, you know."

What happened next would change Sarah's life forever...`;
      } else {
        response = `I understand your request for "${inputValue}". Here's a comprehensive response to help you:

Based on your inquiry, I can provide you with the following information and guidance:

Main Points:
• This is a well-structured response to your question
• I've included relevant details and examples
• The content is formatted for easy reading and understanding

Additional Information:
You may want to consider the following factors when implementing this solution:
- Quality and accuracy of information
- Timeliness of your response
- Appropriate formatting and presentation

Next Steps:
1. Review the provided information
2. Customize it to your specific needs
3. Apply it in your context

This should give you a solid foundation to work with. Feel free to ask if you need any clarification or additional details!`;
      }
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
      }]);
    }, 1000);
  };

  const handleClear = () => {
    setMessages([]);
  };

  const handleApply = () => {
    const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop();
    if (lastAssistantMessage) {
      onApplyContent(lastAssistantMessage.content);
    }
  };

  return (
    <aside className="ai-assistant">
      {/* Header */}
      <div className="ai-header">
        <div className="ai-header-title">
          <div className="ai-avatar">
            <Wand2 size={16} />
          </div>
          <div className="ai-title-text">
            <span className="ai-name">AI Assistant</span>
            <span className="ai-subtitle">Intelligent writing</span>
          </div>
        </div>
        <div className="ai-header-actions">
          <button className="ai-icon-btn" onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button className="ai-icon-btn">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="ai-tabs">
        <button 
          className={`ai-tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageSquare size={14} />
          <span>Chat</span>
        </button>
        <button 
          className={`ai-tab ${activeTab === 'wizard' ? 'active' : ''}`}
          onClick={() => setActiveTab('wizard')}
        >
          <Wand2 size={14} />
          <span>Wizard</span>
        </button>
      </div>

      {/* Messages */}
      <div className="ai-messages">
        {messages.map((message) => (
          <div key={message.id} className={`ai-message ${message.role}`}>
            <p>{message.content}</p>
          </div>
        ))}
        
        {/* Apply Button */}
        {messages.length > 0 && (
          <button className="ai-apply-btn" onClick={handleApply}>
            <Check size={14} />
            <span>Apply</span>
          </button>
        )}
      </div>

      {/* Footer Actions */}
      <div className="ai-footer-actions">
        <button className="ai-action-btn" onClick={handleClear}>
          <Eraser size={14} />
          <span>Clear</span>
        </button>
        <button className="ai-action-btn">
          <Lightbulb size={14} />
          <span>Tips</span>
        </button>
      </div>

      {/* Input */}
      <div className="ai-input-container">
        <button className="ai-input-add">
          <Plus size={16} />
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="ai-input"
        />
        <button className="ai-send-btn" onClick={handleSend}>
          <Send size={16} />
        </button>
      </div>
    </aside>
  );
};

export default AIAssistant;
