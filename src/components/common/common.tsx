export const customStyles: any = {
    headRow: {
        style: {},
    },
    table: {
        style: {
            padding: "6px",
        },
    },
    headCells: {
        style: {
            marginTop: "2px",
            paddingBottom: "10px",
            paddingTop: "10px",
            fontSize: "14px",
            fontWeight: "bold",
            borderTopStyle: 'none'
        },
    }, cells: {
        style: {
            border: "none",
            '&:not(:last-of-type)': {
                paddingTop: "12px",
                paddingBottom: "12px",
                fontSize: "12px",
                border: "none"
            },

        }
    },
    rows: {
        style: {
            border: "none",
            marginTop: "8px",
            marginBottom: "8px",
            '&:not(:last-of-type)': {
                border: "none"
            },
        },
        highlightOnHoverStyle: {
            background: 'unset',
            boxShadow: "var(--box-shadow-low)",
        }
    },
    pagination: {
        style: {
            marginTop: "6px",
            border: "none"
        }
    }
};
