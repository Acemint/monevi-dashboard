<template>
    <MainHeader />
    <!-- Main Content -->
    <div class="main-content">
        <section class="section">
            <div class="section-header">
                <h1>Dashboard</h1>
            </div>
            <div class="row">
                <div class="col-lg-4 col-md-6 col-sm-6 col-12">
                    <div class="card card-statistic-1">
                        <div class="card-icon bg-primary">
                            <i class="fas fa-regular fa-wallet"></i>
                        </div>
                        <div class="card-wrap">
                            <div class="card-header">
                                <h4>Total Saldo</h4>
                            </div>
                            <div class="card-body">
                                Rp 10,000,000
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-6 col-12">
                    <div class="card card-statistic-1">
                        <div class="card-icon bg-warning">
                            <i class="fas fa-money-bill-wave"></i>
                        </div>
                        <div class="card-wrap">
                            <div class="card-header">
                                <h4>Saldo Kas</h4>
                            </div>
                            <div class="card-body">
                                Rp 1,000,000
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-6 col-12">
                    <div class="card card-statistic-1">
                        <div class="card-icon bg-warning">
                            <i class="fas fa-piggy-bank"></i>
                        </div>
                        <div class="card-wrap">
                            <div class="card-header">
                                <h4>Saldo Bank</h4>
                            </div>
                            <div class="card-body">
                                Rp 9,000,000
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="card">
                        <div class="card-header">
                            <h4>Recent Activities</h4>
                        </div>
                        <div class="card-body">
                            <ul class="list-unstyled list-unstyled-border">
                                <li class="media">
                                    <img class="mr-3 rounded-circle" width="50"
                                        src="./assets/img/avatar/avatar-1.png" alt="avatar">
                                    <div class="media-body">
                                        <div class="float-right text-primary">Now</div>
                                        <div class="media-title">Farhan A Mujib</div>
                                        <span class="text-small text-muted">Cras sit amet nibh libero, in
                                            gravida nulla. Nulla vel metus scelerisque ante sollicitudin.</span>
                                    </div>
                                </li>
                                <li class="media">
                                    <img class="mr-3 rounded-circle" width="50"
                                        src="./assets/img/avatar/avatar-2.png" alt="avatar">
                                    <div class="media-body">
                                        <div class="float-right">12m</div>
                                        <div class="media-title">Ujang Maman</div>
                                        <span class="text-small text-muted">Cras sit amet nibh libero, in
                                            gravida nulla. Nulla vel metus scelerisque ante sollicitudin.</span>
                                    </div>
                                </li>
                                <li class="media">
                                    <img class="mr-3 rounded-circle" width="50"
                                        src="./assets/img/avatar/avatar-3.png" alt="avatar">
                                    <div class="media-body">
                                        <div class="float-right">17m</div>
                                        <div class="media-title">Rizal Fakhri</div>
                                        <span class="text-small text-muted">Cras sit amet nibh libero, in
                                            gravida nulla. Nulla vel metus scelerisque ante sollicitudin.</span>
                                    </div>
                                </li>
                                <li class="media">
                                    <img class="mr-3 rounded-circle" width="50"
                                        src="./assets/img/avatar/avatar-4.png" alt="avatar">
                                    <div class="media-body">
                                        <div class="float-right">21m</div>
                                        <div class="media-title">Alfa Zulkarnain</div>
                                        <span class="text-small text-muted">Cras sit amet nibh libero, in
                                            gravida nulla. Nulla vel metus scelerisque ante sollicitudin.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <MainFooter />
</template>

<style>
    @import "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css";
    @import "https://use.fontawesome.com/releases/v5.7.2/css/all.css";
    
    @import "./assets/css/style.css";
</style>

<script lang="ts">
import MainHeader from './components/header/MainHeader.vue'
import MainFooter from './components/footer/MainFooter.vue'
export default {
    
    components: {
        MainHeader,
        MainFooter
    },

    mounted() {
        let jqueryScript = document.createElement('jqueryScript');
        jqueryScript.setAttribute('src', 'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js');
        document.head.appendChild(jqueryScript);

        let popperJsScript = document.createElement('popperJsScript');
        popperJsScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js');
        document.head.appendChild(popperJsScript);

        let bootstrapScript = document.createElement('bootstrapScript');
        bootstrapScript.setAttribute('src', 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js');
        document.head.appendChild(bootstrapScript);

        let momentJsScript = document.createElement('momentJsScript');
        momentJsScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js');
        document.head.appendChild(momentJsScript);

        let stislaScript = document.createElement('stislaScript');
        stislaScript.setAttribute('src', './assets/js/stisla.js');
        document.head.appendChild(stislaScript);
    }
}
</script>