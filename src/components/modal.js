import React, { useState } from "react";
import "./modal.css";
import Dropdown from './dropdown';


// Modal bileşeni. Bu bileşen bir form içeriyor ve kullanıcı bilgilerini toplamak için kullanılıyor.
export const Modal = ({ onSubmit, onCancel }) => {
    // Form verilerini yönetmek için bir state oluşturulur.
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        role: '',
        company_name: '',
    });

    // Rol için dropdown menüsünde kullanılacak seçenekler
    const roleOptions = [
        { value: "Admin", label: "Admin" },
        { value: "Bakım Görevlisi", label: "Bakım Görevlisi" },
        { value: "Teknisyen", label: "Teknisyen" },
    ];

    // Input alanındaki değişiklikleri yakalayıp, formData stateini güncelleyen fonksiyon.
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value, // Değişen input alanının değerini formData stateine kaydeder.
        }));
    };

    // Dropdown bileşeninde seçilen rolü formData stateine kaydeden fonksiyon.
    const handleRoleChange = (selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            role: selectedOption ? selectedOption.value : '', // Eğer bir seçenek seçilmişse seçilen değeri rol olarak kaydeder.
        }));
    };

    // Form gönderildiğinde çalışacak olan fonksiyon. Form verilerini onSubmit fonksiyonuna iletir.
    const handleSubmit = () => {
        onSubmit(formData);
    };

    return (
        <div className="modal-container">
            <div className="modal">
                <div className="modal-header">
                    <h2>Kullanıcı Ekle</h2>
                </div>
                <div className="modal-content">
                    <input
                        type="text"
                        name="name"
                        placeholder="İsim"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="Kullanıcı Adı"
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                    <Dropdown
                        options={roleOptions}
                        onChange={handleRoleChange}
                    />
                    <input
                        type="text"
                        name="company_name"
                        placeholder="Şirket Adı"
                        value={formData.company_name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="modal-footer">
                    <button className="btn btn-submit" onClick={handleSubmit}>Submit</button>
                    <button className="btn btn-cancel" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    )
}


