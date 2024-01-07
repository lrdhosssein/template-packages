import './loading.scss'

const Loading = ({ style, full = false, classes }) => {
    return (
        <div className={`loading-container ${full ? 'full-loading' : ''}`} style={{ ...style }}>
            {full ?
                <div className="loader"></div> :
                <div className={`loading-spinner ${classes?.join(' ')}`} />
            }
        </div>
    )
}

export default Loading
