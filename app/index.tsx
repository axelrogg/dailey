import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";
import { StatusBar } from "expo-status-bar";

export default function Page() {
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [scanned, setScanned] = useState<boolean>(false);
    const [wantsToScan, setWantsToScan] = useState<boolean>(false);
    const [codeType, setCodeType] = useState<string>("");
    const [codeData, setCodeData] = useState<string>("");

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === "granted");
        };
        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = ({ type, data }: BarCodeScannerResult) => {
        setScanned(true);
        setCodeData(data);
        setCodeType(type);
        setWantsToScan(false);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            {!wantsToScan && (
                <>
                    <View style={styles.welcomeTextContainer}>
                        <Text>Welcome to</Text>
                        <Text style={styles.daileyText}>DAILEY</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.scanCodeButtonContainer}
                        onPress={() => {
                            setWantsToScan(true);
                            setScanned(false);
                        }}
                    >
                        <Text style={styles.scanCodeButtonText}>
                            Escanear código
                        </Text>
                    </TouchableOpacity>
                    {codeData && codeType && (
                        <Text style={styles.scannedCodeResultText}>
                            Type: {codeType}. Data: {codeData}
                        </Text>
                    )}
                </>
            )}
            {wantsToScan && (
                <BarCodeScanner
                    onBarCodeScanned={
                        scanned ? undefined : handleBarCodeScanned
                    }
                    style={StyleSheet.absoluteFillObject}
                    barCodeTypes={BarCodeScanner.Constants.BarCodeType.ean13}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    scanCodeButtonContainer: {
        backgroundColor: "#1B669A",
        borderRadius: 10,
        padding: 10,
    },
    scanCodeButtonText: {
        color: "white",
    },
    scannedCodeResultText: {
        marginVertical: 20,
    },
    daileyText: {
        color: "#1B669A",
        fontSize: 50,
        fontWeight: "bold",
    },
    welcomeTextContainer: {
        alignItems: "center",
        marginBottom: 10,
    },
});
