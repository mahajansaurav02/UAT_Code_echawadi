import { PageContainer } from '@ant-design/pro-layout';
import { Card, Avatar, Input, Button, message, Spin } from 'antd';
import { FormattedMessage, useIntl } from 'umi';
import moment from 'moment';
import './abhipray-yadi.css'; 
import React, { useState, useRef, useEffect, useCallback } from 'react';

// Core Imports: Village selector and API configuration
import VillageSelector from '@/components/eComponents/VillageSelector'; 
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';

const { TextArea } = Input;

const AbhiprayYadi = () => {
  // --- State Management ---
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachment, setAttachment] = useState(null);
  
  // Village Selector States
  const [codeVillage, setCodeVillage] = useState('');
  const [revenueYear, setRevenueYear] = useState('2025-26'); 
  const [textForVillage, setTextForVillage] = useState(''); 
  const [isNirank, setIsNirank] = useState(false);          
  
  // Refs for DOM manipulation
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null); // Ref for auto-scrolling the chat

  const intl = useIntl();
  const { sendRequest } = useAxios();

  // Local Storage Data
  const currentServarthId = localStorage.getItem('servarthId') || '';
  const fullName = localStorage.getItem('fullName') || 'Talathi'; 

  // --- Box Locking Logic ---
  // Check if the last message was sent by the Talathi. If yes, lock the box.
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const isWaitingForReply = lastMessage && lastMessage.role === 'Talathi';
  
  // Master boolean to disable the inputs
  const isBoxDisabled = isSubmitting || !codeVillage || isWaitingForReply;


  // --- Utility: Auto-scroll to the latest message ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); 


  // --- GET API: Fetch Remarks Logic ---
  const fetchRemarks = useCallback(() => {
    if (!codeVillage) return; 

    // Only show the main loading spinner if the chat is currently empty. 
    // This prevents the screen from clearing/flickering during background refreshes.
    if (messages.length === 0) {
      setLoading(true);
    }
    
    sendRequest(
      `${URLS.BaseURL}/inpsection/getTalathiRemarkInspection?revenueYear=${revenueYear}&ccode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        const data = res.data || []; 
        
        // Format the backend data to match the chat UI structure
        const formattedData = Array.isArray(data) ? data.map((item, index) => {
          const isIO = item.designation === 'INOFICER' || item.role === 'Inspection Officer';

          return {
            id: item.id || index + 1,
            date: item.remarkDate ? moment(item.remarkDate).format('DD MMM YYYY') : moment().format('DD MMM YYYY'),
            time: item.remarkTime ? moment(item.remarkTime, 'HH:mm:ss').format('h:mm A') : moment().format('h:mm A'),
            role: isIO ? 'Inspection Officer' : 'Talathi',
            name: item.officerName || item.name || (isIO ? 'Rajesh Patil' : 'Suresh Deshmukh'),
            avatarInitials: isIO ? 'IO' : 'TL',
            avatarColor: isIO ? '#5f7cf6' : '#d32453',
            align: isIO ? 'left' : 'right', // Dynamically align based on role
            text: item.remark || item.text || '',
            attachment: item.attachment || null,
          };
        }) : [];

        setMessages(formattedData);
        setLoading(false);
      },
      (err) => {
        console.error("Failed to fetch remarks:", err);
        message.error(intl.formatMessage({ id: 'abhiprayYadi.fetchError', defaultMessage: 'Failed to load remarks data.' }));
        setLoading(false);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeVillage, revenueYear, intl]); 

  // Trigger fetch when village or year changes
  useEffect(() => {
    fetchRemarks();
  }, [fetchRemarks]); 

  // Group messages by date to show the date dividers in the UI
  const groupedMessages = messages.reduce((acc, msg) => {
    if (!acc[msg.date]) acc[msg.date] = [];
    acc[msg.date].push(msg);
    return acc;
  }, {});


  // --- File Attachment Handlers ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setAttachment(file);
  };

  const clearAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };


  // --- POST API: Submit Remark Logic ---
  const handleSubmitReply = () => {
    if (!replyText.trim()) {
      message.warning(intl.formatMessage({ id: 'abhiprayYadi.emptyWarning', defaultMessage: 'Please type a remark.' }));
      return;
    }

    if (!codeVillage) {
      message.error("Village Code is required!");
      return;
    }

    setIsSubmitting(true);

    const payload = { 
      ccode: codeVillage, 
      remark: replyText,
      designation: "Talathi", 
      servarthId: currentServarthId, 
      inspectionOfficerUsername: currentServarthId 
    };

    sendRequest(
      `${URLS.BaseURL}/inpsection/saveTalathiRemark`, 
      'POST', 
      payload,
      (res) => {
        // Success: Clear the inputs
        setAttachment(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setReplyText('');
        setIsSubmitting(false);
        
        message.success(intl.formatMessage({ id: 'abhiprayYadi.successMsg', defaultMessage: 'Remark submitted successfully!' }));
        
        // Immediately add it to UI to lock the box instantly
        const newMessage = {
          id: Date.now(),
          date: moment().format('DD MMM YYYY'),
          time: moment().format('h:mm A'),
          role: 'Talathi',       
          name: fullName, 
          avatarInitials: 'TL',  
          avatarColor: '#d32453', 
          align: 'right',
          text: replyText,
          attachment: attachment ? attachment.name : null,
        };
        setMessages((prev) => [...prev, newMessage]);

        // Refetch the updated list from the server to ensure database sync
        fetchRemarks(); 
      },
      (err) => {
        console.error("API Error:", err);
        message.error("Error saving remark. Please try again.");
        setIsSubmitting(false);
      }
    );
  };

  return (
    <PageContainer header={{ title: '', breadcrumb: {} }}>
      
      {/* Village Selector Component */}
      <div style={{ padding: '20px', background: '#fff', marginBottom: '20px', borderRadius: '8px', boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16)' }}>
        <VillageSelector 
          pageType="withoutYear" 
          setCodeVillage={setCodeVillage} 
          setTextForVillage={setTextForVillage} 
          setIsNirank={setIsNirank}
          onVillageChange={() => {}}
        />
      </div>

      <div className="layoutWrapper" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        
        {/* LEFT SIDEBAR: Static Summary Data */}
        <aside className="leftSidebar" style={{ width: '280px', flexShrink: 0 }}>
          <Card className="summaryCard">
            <div className="cardLabel">
              <FormattedMessage id="abhiprayYadi.totalRemarks" defaultMessage="Total Remarks" />
            </div>
            <div className="cardValue">{messages.length}</div>
          </Card>

          <Card className="summaryCard">
            <div className="cardLabel">
              <FormattedMessage id="abhiprayYadi.initiatedBy" defaultMessage="Initiated by" />
            </div>
            <div className="cardValue">Inspection Officer</div>
          </Card>

          <Card className="summaryCard">
            <div className="cardLabel">
              <FormattedMessage id="abhiprayYadi.lastActivity" defaultMessage="Last Activity" />
            </div>
            <div className="cardValue">Today, {moment().format('h:mm A')}</div>
          </Card>
        </aside>

        {/* RIGHT SECTION: Chat Window (Fixed height + Flexbox for scrolling) */}
        <main className="chatSection" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '65vh', background: '#fff', borderRadius: '8px', border: '1px solid #d9d9d9' }}>
          
          {/* Scrollable Chat History Container */}
          <div className="chatContainer" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {!codeVillage ? (
              <div style={{ textAlign: 'center', padding: '50px', color: '#faad14', fontWeight: 'bold' }}>
                Please select a village to view remarks.
              </div>
            ) : loading ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
              </div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                <FormattedMessage id="abhiprayYadi.noRemarks" defaultMessage="No conversation history found." />
              </div>
            ) : (
              Object.keys(groupedMessages).map(date => (
                <div key={date}>
                  {/* Date Divider */}
                  <div className="dateDivider">
                    {date}
                  </div>

                  {/* Message Bubbles (All inline styles removed to respect your CSS) */}
                  {groupedMessages[date].map(msg => (
                    <div key={msg.id} className={`messageRow ${msg.align}`}>
                      
                      {/* Left Avatar */}
                      {msg.align === 'left' && (
                        <Avatar size={40} style={{ backgroundColor: msg.avatarColor, marginTop: '20px' }}>
                          {msg.avatarInitials}
                        </Avatar>
                      )}

                      <div className={`messageContent ${msg.align}`}>
                        <div className="senderInfo">
                          {msg.role} — {msg.name}
                        </div>
                        
                        <div className={`messageBubble ${msg.align}`}>
                          {msg.text}
                        </div>
                        
                        {/* Attachments rendering */}
                        {msg.attachment && (
                          <div className="attachmentTag">
                            📎 {msg.attachment}
                          </div>
                        )}
                        
                        <div className="timeStamp">
                          {msg.time}
                        </div>
                      </div>

                      {/* Right Avatar */}
                      {msg.align === 'right' && (
                        <Avatar size={40} style={{ backgroundColor: msg.avatarColor, marginTop: '20px' }}>
                          {msg.avatarInitials}
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}
            
            {/* Auto-scroll anchor point */}
            <div ref={messagesEndRef} />
          </div>

          {/* Fixed Reply Box at the Bottom */}
          <div className="replyBox" style={{ padding: '20px', borderTop: '1px solid #f0f0f0', backgroundColor: isWaitingForReply ? '#fafafa' : '#fff' }}>
            <div className="replyHeader">
              <FormattedMessage id="abhiprayYadi.addReply" defaultMessage="Add a remark reply" />
            </div>
            
            <TextArea
              rows={3}
              maxLength={250}
              showCount
              disabled={isBoxDisabled} 
              placeholder={
                isWaitingForReply 
                  ? intl.formatMessage({ id: 'abhiprayYadi.waitingReply', defaultMessage: "Waiting for Inspection Officer's reply..." })
                  : intl.formatMessage({ id: 'abhiprayYadi.placeholder', defaultMessage: 'Type your remark here...' })
              }
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              style={{ 
                borderRadius: '6px', 
                marginBottom: '16px',
                cursor: isBoxDisabled ? 'not-allowed' : 'text'
              }}
            />
            
            <div className="replyActions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <Button onClick={() => fileInputRef.current.click()} disabled={isBoxDisabled}>
                  <FormattedMessage id="abhiprayYadi.attachDoc" defaultMessage="+ Attach document" />
                </Button>

                {attachment && (
                  <span className="attachmentTag" style={{ marginLeft: 12 }}>
                    📎 {attachment.name}
                    <span
                      onClick={clearAttachment}
                      style={{ cursor: 'pointer', marginLeft: 8, color: '#d32453', fontWeight: 'bold' }}
                    >
                      ✕
                    </span>
                  </span>
                )}
              </div>
              
              <Button
                type="primary"
                style={{ 
                  backgroundColor: isBoxDisabled ? '#d9d9d9' : '#4272c7', 
                  borderColor: isBoxDisabled ? '#d9d9d9' : '#4272c7',
                  color: isBoxDisabled ? 'rgba(0, 0, 0, 0.25)' : '#fff'
                }}
                onClick={handleSubmitReply}
                loading={isSubmitting}
                disabled={isBoxDisabled} 
              >
                <FormattedMessage id="abhiprayYadi.submitBtn" defaultMessage="Submit remark" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </PageContainer>
  );
};

export default AbhiprayYadi;