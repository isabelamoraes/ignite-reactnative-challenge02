import React, {
    createContext,
    ReactNode,
    useContext,
    useState,
    useEffect
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StorageProviderProps {
    children: ReactNode;
}

interface LoginDataProps {
    id: string;
    title: string;
    email: string;
    password: string;
  };
  
type LoginListDataProps = LoginDataProps[];

interface IStorageDataContext {
    dataStorage: LoginListDataProps;
    setStorageData: (data: LoginListDataProps) => void;
    getStorageData(): Promise<void>;
    dataStorageLoading: boolean
}

const StorageDataContext = createContext({} as IStorageDataContext);

function StorageDataProvider({ children }: StorageProviderProps) {
    const [dataStorage, setDataStorage] = useState<LoginListDataProps>([]);
    const [dataStorageLoading, setDataStorageLoading] = useState(true);

    const dataKey = `@passmanager:logins`;

    async function setStorageData(data: LoginListDataProps) {
        try {

            await AsyncStorage.setItem(dataKey, JSON.stringify(data));

        } catch (error) {
            throw new Error(error);
        }
    }

    async function getStorageData() {
        try {

            const response = await AsyncStorage.getItem(dataKey);
            const storageData = response ? JSON.parse(response) : [];

            setDataStorage(storageData);

            setDataStorageLoading(false)

        } catch (error) {
            throw new Error(error);
        }
    }

    useEffect(() => {
        getStorageData();
    }, [])

    return (
        <StorageDataContext.Provider value={{
            dataStorage,
            setStorageData,
            getStorageData,
            dataStorageLoading
        }}>
            {children}
        </StorageDataContext.Provider>
    )
}

function useStorageData() {
    const context = useContext(StorageDataContext);

    return context;
}

export { StorageDataProvider, useStorageData }