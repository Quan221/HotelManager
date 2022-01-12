function addToCart(id, name, price) {
    event.preventDefault()
    let check_in = document.querySelector('#startdate').value;

    let check_out = document.querySelector('#enddate').value;

    // promise
    fetch('/api/add-to-cart', {
        method: 'post',
        body: JSON.stringify({
            'id': id,
            'name': name,
            'price': price,
            'check_in': check_in,
            'check_out': check_out
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function(res) {
        return res.json()
    }).then(function(data) {
        let d = document.getElementById('cartCounter')
        d.innerText = data.total_quantity
    })
}

function pay() {
    if (confirm('Ban chac chan thanh toan khong?') == true) {
        fetch('/api/pay', {
            method: 'post'
        }).then(function(res) {
            return res.json()
        }).then(function(data) {
            if (data.code === 200)
                location.reload()
        })
    }
}

function updateCart(obj, id) {
    fetch('/api/update-cart', {
        method: 'put',
        body: JSON.stringify({
            'id': id,
            'quantity': parseInt(obj.value)
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(data => {
        if (data.code == 200) {
            let d = document.getElementById('cartCounter')
            let d2 = document.getElementById('cartCounter2')
            let amount = document.getElementById('cartAmount')
            d.innerText = data.data.total_quantity
            d2.innerText = data.data.total_quantity
            amount.innerText = data.data.total_amount
        } else if (data.code == 404)
            alert(data.err_msg)
    }).catch(err => console.error(err))
}

function deleteCart(productId) {
    if (confirm('Ban chac chan xoa san pham!!!') == true) {
        fetch(`/api/delete-cart/${productId}`, {
            method: 'delete'
        }).then(res => res.json()).then(data => {
            if (data.code == 200) {
                let d = document.getElementById('cartCounter')
                let d2 = document.getElementById('cartCounter2')
                let amount = document.getElementById('cartAmount')
                d.innerText = data.data.total_quantity
                d2.innerText = data.data.total_quantity
                amount.innerText = data.data.total_amount

                location.reload()
//                let r = document.getElementById(`product${productId}`)
//                r.style.display = 'none'
            } else if (data.code == 404)
                alert(data.err_msg)
        }).catch(err => console.error(err))
    }
}


function addComment(roomId){
    let content = document.getElementById('commentId')
    if (content !== null){
        fetch('/api/comments',{
            method:'post',
            body:JSON.stringify({
                'room_id' : roomId,
                'content' : content.value
            }),
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(data =>{
            if (data.status == 201){
                let c = data.comment

                let area = document.getElementById('commentArea')
                area.innerHTML = `
                    <div class="row">
                        <div class="col-md-1 col-xs-4">
                            <img src="${c.user.avatar}"
                                 class="img-fluid rounded-circle" alt="demo">
                        </div>
                        <div class="col-md-11 col-xs-8">
                            <p>${c.content}</p>
                            <p><em>${moment(c.created_date).fromNow()}</em></p>
                        </div>
                    </div>
                ` + area.innerHTML
            }
            else if(data.status == 404)
                alert(data.err_msg)
        })
    }
}