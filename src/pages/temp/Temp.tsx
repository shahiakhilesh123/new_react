import React from "react";
import getSymbolFromCurrency from "currency-symbol-map";
import {Container} from "react-bootstrap";

export default function Temp() {
    return <Container>
        <div className="d-flex">
        <div >
            <div>

            </div>
            <table>
                <tr>
                    <th>
                        Symbol With Futura font
                    </th>
                    <th>
                        Symbol With "Helvetica Neue", Helvetica, Arial, sans-serif
                    </th>
                </tr>
                {
                    ["AED",
                        "GTQ",
                        "PEN",
                        "AFN",
                        "GYD",
                        "PGK",
                        "ALL",
                        "HKD",
                        "PHP",
                        "AMD",
                        "HNL",
                        "PKR",
                        "ANG",
                        "HRK",
                        "PLN",
                        "AOA",
                        "HTG",
                        "PYG",
                        "ARS",
                        "HUF",
                        "QAR",
                        "AUD",
                        "IDR",
                        "RON",
                        "AWG",
                        "ILS",
                        "RSD",
                        "AZN",
                        "INR",
                        "RUB",
                        "BAM",
                        "ISK",
                        "RWF",
                        "BBD",
                        "JMD",
                        "SAR",
                        "BDT",
                        "JPY",
                        "SBD",
                        "BGN",
                        "KES",
                        "SCR",
                        "BIF",
                        "KGS",
                        "SEK",
                        "BMD",
                        "KHR",
                        "SGD",
                        "BND",
                        "KMF",
                        "SHP",
                        "BOB",
                        "KRW",
                        "SLL",
                        "BRL",
                        "KYD",
                        "SRD",
                        "BSD",
                        "KZT",
                        "STD",
                        "BWP",
                        "LAK",
                        "SZL",
                        "BZD",
                        "LBP",
                        "THB",
                        "CAD",
                        "LKR",
                        "TJS",
                        "CDF",
                        "LRD",
                        "TOP",
                        "CHF",
                        "LSL",
                        "TRY",
                        "CLP",
                        "MAD",
                        "TTD",
                        "CNY",
                        "MDL",
                        "TWD",
                        "COP",
                        "MGA",
                        "TZS",
                        "CRC",
                        "MKD",
                        "UAH",
                        "CVE",
                        "MMK",
                        "UGX",
                        "CZK",
                        "MNT",
                        "USD",
                        "DJF",
                        "MOP",
                        "UYU",
                        "DKK",
                        "MUR",
                        "UZS",
                        "DOP",
                        "MVR",
                        "VND",
                        "DZD",
                        "MWK",
                        "VUV",
                        "EGP",
                        "MXN",
                        "WST",
                        "ETB",
                        "MYR",
                        "XAF",
                        "EUR",
                        "MZN",
                        "XCD",
                        "FJD",
                        "NAD",
                        "XOF",
                        "FKP",
                        "NGN",
                        "XPF",
                        "GBP",
                        "NIO",
                        "YER",
                        "GEL",
                        "NOK",
                        "ZAR",
                        "GIP",
                        "NPR",
                        "ZMW",
                        "GMD",
                        "NZD",
                        "GNF",
                        "PAB"].map(value => {
                        return {
                            symbol:getSymbolFromCurrency(value),
                            code:value
                        }
                    }).map(value => {
                        return <tr>
                            <td>
                                {value.code} <span>{value.symbol}</span>
                            </td>
                            <td>
                                {value.code} <span className="currency-symbol">{value.symbol}</span>
                            </td>
                        </tr>
                    })
                }
            </table>

        </div>

    </div>
    </Container>
}
