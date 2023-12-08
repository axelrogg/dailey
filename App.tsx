import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";
import { StatusBar } from "expo-status-bar";

export default function App() {
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
        <>
            {!wantsToScan && (
                <View style={styles.baseContainer}>
                    <StatusBar style="auto" />
                    <View style={styles.welcomeTextContainer}>
                        <Text>Bienvenido a</Text>
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
                </View>
            )}
            {wantsToScan && (
                <View style={styles.scanningContainer}>
                    <StatusBar style="dark" />
                    <BarCodeScanner
                        onBarCodeScanned={
                            scanned ? undefined : handleBarCodeScanned
                        }
                        style={styles.scanner}
                        barCodeTypes={
                            BarCodeScanner.Constants.BarCodeType.ean13
                        }
                    >
                        <TouchableOpacity
                            style={styles.exitScannerButtonContainer}
                            onPress={() => setWantsToScan(false)}
                        >
                            <Text style={styles.exitScannerButtonX}>X</Text>
                        </TouchableOpacity>
                    </BarCodeScanner>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    baseContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    daileyText: {
        color: "#1B669A",
        fontSize: 50,
        fontWeight: "bold",
    },
    exitScannerButtonContainer: {
        alignItems: "center",
        justifyContent: "center",
        left: 10,
        padding: 10,
        top: 10,
        width: 35,
    },
    exitScannerButtonX: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    scanner: {
        bottom: 100,
        left: 0,
        position: "absolute",
        top: 60,
        width: "100%",
    },
    scanningContainer: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "black",
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
    welcomeTextContainer: {
        alignItems: "center",
        marginBottom: 10,
    },
});
