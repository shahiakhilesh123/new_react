export interface iSideBarNavigation {
    link: string,
    svg_node: any,
    active_node?: any
    text: string,
    "data-tut": string
    badgeCount?: string
}

export interface iSideBarComponentProps {
    links: iSideBarNavigation[]
}

export interface iCategory {
    title: string,
    done: boolean
}

export interface iProgressSteps {
    category: string,
    sub_category: iCategory[]
}

export interface iSetupProgressProps {
    progress: iProgressSteps[]
}

export interface iSetupProps extends iSetupProgressProps {

}

export interface iSetupControllerStates extends iSetupProps {

}

export interface iAppPaginationProps {
    onPageChange?: (page_number: number) => void
    current_page: number,
    total_pages: number
}
