export function handleEqualAndGreaterZeroMax100Change(e: any, handleChange: any) {
    if (!e.target.value) return handleChange(e);
    if (e.target.value === "0") {
        handleChange(e);
    }
    if (e.target.value.match(/[1-9]\d{0,5}/)) {
        if (e.target.value >= 0 && e.target.value <= 100) {
            handleChange(e);
        }
    }

}

interface iSortOrder {
    sort_order?: string
    sort_direction?: "desc" | "asc"
}

export const getSortOrder = (list_key: string, default_order?: iSortOrder): iSortOrder => {
    let data = window.localStorage.getItem(list_key);
    console.log(data)
    try {
        if (data != null) {
            let a: iSortOrder = JSON.parse(data);
            let b: iSortOrder = {}
            if (a.sort_direction) {
                b.sort_direction = a.sort_direction;
            }
            if (a.sort_order) {
                b.sort_order = a.sort_order;
            }
            return b
        }
        return {}
    } catch (e) {
        return default_order || {}
    }
}
export const saveSortOrder = (list_key: string, sort_order?: iSortOrder) => {
    if (sort_order && (sort_order.sort_order || sort_order.sort_direction)) {
        window.localStorage.setItem(list_key, JSON.stringify({
            sort_order: sort_order.sort_order,
            sort_direction: sort_order.sort_direction
        }))
    }
}
