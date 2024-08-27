import React, { useState, useEffect } from 'react';
import '../userPage.css';
import '../dropdown.js';

import { Modal } from '../modal.js';
import { useNavigate } from 'react-router-dom';

import { Icon } from 'react-icons-kit';
import { bin } from 'react-icons-kit/ikons/bin';
import { userPlus } from 'react-icons-kit/icomoon/userPlus';
import { exit } from 'react-icons-kit/icomoon/exit';

export const IconBin = ({ size = 24 }) => <Icon icon={bin} size={size} />;
export const IconUserPlus = ({ size = 24 }) => <Icon icon={userPlus} size={size} />;
export const IconExit = ({ size = 22 }) => <Icon icon={exit} size={size} />;

function UserPage() {
    const [data, setData] = useState([]);
    const [checkedBoxes, setCheckedBoxes] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // Arama terimi için state
    const navigate = useNavigate();

    const handleLogout = () => {
        // Kullanıcı çıkış işlemi: localStorage'dan kullanıcı bilgilerini siler ve login sayfasına yönlendirir.
        localStorage.removeItem('user');
        navigate('/login');
    };

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            // Eğer kullanıcı giriş yapmamışsa login sayfasına yönlendirir.
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        // Kullanıcı verilerini çeker ve state'e kaydeder.
        fetch('http://localhost:3001/api/data')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Veri çekilirken hata oluştu:', error));
    }, []);

    const toggleCheckbox = (e, item) => {
        // Bir kutucuk işaretlendiğinde veya işareti kaldırıldığında state güncellenir.
        if (e.target.checked) {
            setCheckedBoxes([...checkedBoxes, item.id]);
        } else {
            setCheckedBoxes(checkedBoxes.filter(id => id !== item.id));
        }
    };

    const deleteUsers = () => {
        // Seçilen kullanıcıları silme işlemi
        if (window.confirm('Are you sure you want to delete the selected user(s)?')) {
            fetch('http://localhost:3001/delete/data', {
                method: 'POST',
                body: JSON.stringify({ ids: checkedBoxes }),
                headers: { 'Content-Type': 'application/json; charset=UTF-8' }
            }).then(response => {
                if (response.status === 200) {
                    // Silme işlemi başarılı olduğunda mesaj gönderir ve listeyi günceller.
                    const msgElement = document.getElementById('msg');
                    msgElement.innerHTML = '<span style="color:green;">Users deleted successfully</span>';

                    // 3 saniye sonra mesajı temizler.
                    setTimeout(() => {
                        msgElement.innerHTML = '';
                    }, 3000);

                    // Silinen kullanıcıları listeden çıkarır.
                    setData(data.filter(item => !checkedBoxes.includes(item.id)));
                    setCheckedBoxes([]);
                }
            }).catch(error => console.error('Kullanıcılar silinirken hata oluştu:', error));
        }
    };

    // Modal formunu görünür hale getirir.
    const addUser = () => {
        setIsModalVisible(true);
    };

    // Modal formunu kapatır.
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // API'ye yeni kullanıcıyı gönderir ve listeyi günceller.
    const handleSubmit = (formData) => {
        // Yeni kullanıcı için ID oluşturur.
        const maxId = data.length > 0 ? Math.max(...data.map(item => item.id)) : 0;
        const newId = maxId + 1;
        const newUser = { ...formData, id: newId };

        fetch('http://localhost:3001/add/data', {
            method: 'POST',
            body: JSON.stringify(newUser),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(savedUser => {
                // Yeni kullanıcı başarıyla eklendiğinde listeye ekler ve modal formunu kapatır.
                setData([...data, savedUser]);
                setIsModalVisible(false);
            })
            .catch(error => console.error('Kullanıcı eklenirken hata oluştu:', error));
    };

    // Arama terimine göre verileri filtreleyen işlev
    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toString().includes(searchTerm)
    );

    return (
        <div className="container">
            <div id="msg"></div>
            <div className="header">
                <h2>Kullanıcılar</h2>
                <div className="searchContainer">
                    <input
                        type="text"
                        placeholder="Ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="searchBar"
                    />
                </div>
                <button type="button" onClick={addUser} className="iconUserPlus">
                    <IconUserPlus />
                </button>
                <button
                    type="button"
                    onClick={deleteUsers}
                    className="iconBin"
                    disabled={checkedBoxes.length === 0} // Hiçbir kutucuk seçilmemişse silme butonu devre dışı bırakılır.
                >
                    <IconBin />
                </button>
                <div>
                    <button type="button" onClick={handleLogout} className="exit" >
                        <IconExit />
                        Çıkış Yap
                    </button>
                </div>
            </div>

            {isModalVisible && (
                <Modal
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            )}

            <table className="data-table">
                {/* İlk satırda datadan çekilen değişkenlerin isimleri yazdırılır. */}
                <thead>
                    <tr>
                        <th>Seç</th>
                        <th>ID</th>
                        <th>İsim</th>
                        <th>Email</th>
                        <th>Kullanıcı Adı</th>
                        <th>Rol</th>
                        <th>Şirket Adı</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={checkedBoxes.includes(item.id)}
                                    onChange={(e) => toggleCheckbox(e, item)}
                                />
                            </td>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.username}</td>
                            <td>{item.role}</td>
                            <td>{item.company_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserPage;

