export const checkIsPro = (isPro, proType) => {
    return Boolean(isPro || !proType || (isPro && proType))
}

export const getProLabel = (label) => {
    return (
        <span>
            {label} <small className="txt-purple">(Pro)</small>
        </span>
    )
}