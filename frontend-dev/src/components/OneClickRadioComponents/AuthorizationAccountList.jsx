import React, { useState, useEffect, useRef } from 'react';
import bitsFetch from '../../Utils/bitsFetch';
import TrashIcn from '../../Icons/TrashIcn';

const AuthorizationAccountList = ({ authData, setAuthData, selectedUserId, setSelectedUserId, setIsLoading, isEdit, isInfo }) => {
  const [showConfirm, setShowConfirm] = useState(null);
  const popoverRef = useRef(null);

  const handleDelete = (id) => {
    setIsLoading(true);
    bitsFetch(id, 'auth/account/delete').then((res) => {
      if (res.success) {
        setAuthData((prevData) => prevData.filter((item) => item.id !== id));
        if (selectedUserId === id) {
          setSelectedUserId(null);
        }

        setIsLoading(false);
      }
    });

    setShowConfirm(null);
  };

  const handleConnectionSelection = (id) => {
    setSelectedUserId(id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowConfirm(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // if (selectedUserId !== null) {
    //   setSelectedUserId(selectedUserId)
    // }

    if (isInfo || isEdit) {
      return
    }

    if (authData.length === 1) {
      setSelectedUserId(authData[0].id);
    } else if (!selectedUserId && authData.length > 0) {
      setSelectedUserId(authData[authData.length - 1].id);
    }
  }, [authData]);

  return (
    <div className="user-radio-input">
      <div className="auth-list">
        {authData.map((user) => (
          <div key={user.id} className={`auth-item ${selectedUserId === user.id ? 'active' : ''}`}>
            <label className="auth-label">
              <input
                type="radio"
                name="auth"
                value={user.id}
                checked={selectedUserId === user.id}
                onChange={() => handleConnectionSelection(user.id)}
                className="radio-input"
              />
              <div className="auth-info">
                <img src={user?.userInfo?.user?.photoLink} alt="User Avatar" className="user-avatar" />
                <div>
                  <div className="user-name">{user?.userInfo?.user?.displayName}</div>
                  <div className="user-email">{user?.userInfo?.user?.emailAddress}</div>
                </div>
              </div>
            </label>
            {!isInfo && (
              <div className="delete-section">
                {showConfirm === user.id ? (
                  <div className="confirmation-popover" ref={popoverRef}>
                    <p>Are you sure?</p>
                    <button className="confirm-button" onClick={() => handleDelete(user.id)}>Yes</button>
                    <button className="cancel-button" onClick={() => setShowConfirm(null)}>No</button>
                  </div>
                ) : (
                  <button className="delete-button" onClick={() => setShowConfirm(user.id)}>
                    <TrashIcn />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthorizationAccountList;
